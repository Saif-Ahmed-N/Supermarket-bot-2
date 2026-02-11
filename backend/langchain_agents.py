from typing import List, Dict, Any, Optional
try:
    from langchain import LLMChain  # optional, only used if available
except Exception:
    LLMChain = None

from sqlalchemy.orm import Session
from sqlalchemy import func
from .utils import similarity
from . import models


class SimpleShoppingAgent:
    """A lightweight DB-aware agent helper to orchestrate LLM parsing + product lookup.

    Accepts a SQLAlchemy `db` session to return full product rows in responses.
    """
    def __init__(self, llm_service, db: Session, categories: List[str], products: List[str]):
        self.llm_service = llm_service
        self.db = db
        self.categories = categories or []
        self.products = products or []

    def _row_to_dict(self, p: models.Product) -> Dict[str, Any]:
        if not p:
            return {}
        return {
            "id": p.index,
            "name": p.product,
            "sale_price": p.sale_price,
            "market_price": p.market_price,
            "category": p.category,
            "image_url": p.image_url,
            "description": p.description,
            "brand": p.brand,
            "rating": p.rating,
            "is_veg": p.is_veg,
            "unit_type": p.unit_type,
            "weight_str": p.weight_str,
        }

    def _fetch_product_by_name(self, name: str, brand: Optional[str] = None) -> Optional[models.Product]:
        """Try several matching strategies in order:
        1. Exact (case-insensitive) equality
        2. Startswith / token match (brand filtered if provided)
        3. Fallback: pick best fuzzy match among partial results
        Returns first matching row or None.
        """
        if not name:
            return None
        name_clean = name.strip().lower()

        # 1) exact match
        q_exact = self.db.query(models.Product).filter(func.lower(models.Product.product) == name_clean)
        if brand:
            q_exact = q_exact.filter(func.lower(models.Product.brand) == (brand.strip().lower()))
        exact = q_exact.first()
        if exact:
            return exact

        # 2) startswith / token match
        q_token = self.db.query(models.Product).filter(models.Product.product.ilike(f"{name_clean}%"))
        if brand:
            q_token = q_token.filter(models.Product.brand.ilike(f"%{brand}%"))
        token_first = q_token.first()
        if token_first:
            return token_first

        # 3) partial matches: gather candidates and pick best fuzzy
        q_partial = self.db.query(models.Product).filter(models.Product.product.ilike(f"%{name_clean}%"))
        if brand:
            q_partial = q_partial.filter(models.Product.brand.ilike(f"%{brand}%"))
        candidates = q_partial.limit(10).all()
        if not candidates:
            return None

        # choose candidate with highest similarity score
        best = None
        best_score = 0.0
        for c in candidates:
            s = similarity(name_clean, c.product or "")
            if s > best_score:
                best_score = s
                best = c
        return best

    def _fetch_products_by_names(self, names: List[str], limit: int = 5, brand: Optional[str] = None) -> List[models.Product]:
        results = []
        for n in names[:limit]:
            r = self._fetch_product_by_name(n, brand=brand)
            if r:
                results.append(r)
        return results

    def run_query(self, user_message: str) -> Dict[str, Any]:
        # Parse intent with context
        resp = self.llm_service.parse_with_context(user_message, self.categories, self.products)
        if not resp:
            return {"success": False, "error": "Could not understand query"}

        qt = resp.query_type

        # PRICE_QUERY: return full product row, or suggestion, or similar list
        if qt == "PRICE_QUERY":
            name = resp.product_name
            resolved = self.llm_service.resolve_product_name(name, self.products)

            if resolved.get("matched"):
                prod = self._fetch_product_by_name(resolved["matched"], brand=resp.brand)
                if prod:
                    return {
                        "success": True,
                        "query_type": "PRICE_QUERY",
                        "action": "display_price",
                        "product": self._row_to_dict(prod),
                        "message": f"The price of {prod.product} is ₹{prod.sale_price}",
                        "confidence": resp.confidence,
                    }
            if resolved.get("ask_confirmation") and resolved.get("suggestion"):
                suggestion_name = resolved.get("suggestion")
                prod = self._fetch_product_by_name(suggestion_name, brand=resp.brand)
                return {
                    "success": False,
                    "query_type": "PRICE_QUERY",
                    "action": "ask_confirmation",
                    "suggestion": self._row_to_dict(prod) if prod else {"name": suggestion_name},
                    "message": f"Did you mean '{suggestion_name}'?",
                    "confidence": resp.confidence,
                }

            # No close match — return similar product rows
            sims = self.llm_service.search_similar(name, self.products, limit=5)
            similar_names = [s[0] for s in sims]
            prods = self._fetch_products_by_names(similar_names, limit=5, brand=resp.brand)
            return {
                "success": False,
                "query_type": "PRICE_QUERY",
                "action": "show_similar",
                "similar": [self._row_to_dict(p) for p in prods],
                "message": "No exact match found — showing similar products.",
                "confidence": resp.confidence,
            }

        # CATEGORY_FILTER: query DB for category and return product rows
        if qt == "CATEGORY_FILTER":
            cat = (resp.category or "").strip()
            products = self.db.query(models.Product).filter(models.Product.category.ilike(f"%{cat}%")).limit(resp.limit or 5).all()
            if products:
                return {
                    "success": True,
                    "query_type": "CATEGORY_FILTER",
                    "action": "display_products",
                    "category": resp.category,
                    "products": [self._row_to_dict(p) for p in products],
                    "message": f"Found {len(products)} products in '{resp.category}'",
                    "confidence": resp.confidence,
                }
            return {
                "success": False,
                "query_type": "CATEGORY_FILTER",
                "action": "not_found",
                "category": resp.category,
                "message": f"No products found in '{resp.category}'",
                "confidence": resp.confidence,
            }

        # CART_ADD: resolve and return product row + quantity for frontend to add
        if qt == "CART_ADD":
            name = resp.product_name
            prod = None

            # 1) Try resolving against sample product list first
            resolved = self.llm_service.resolve_product_name(name, self.products)
            if resolved.get("matched"):
                prod = self._fetch_product_by_name(resolved.get("matched"), brand=resp.brand)

            # 2) If sample list failed, search the database directly
            if not prod and name:
                prod = self._fetch_product_by_name(name, brand=resp.brand)

            # 3) If we found a product, return success
            if prod:
                return {
                    "success": True,
                    "query_type": "CART_ADD",
                    "action": "add_to_cart",
                    "product": self._row_to_dict(prod),
                    "quantity": resp.quantity or 1,
                    "message": f"Adding {resp.quantity or 1} x {prod.product} to cart",
                    "confidence": resp.confidence,
                }

            # 4) Try suggestion from sample list
            if resolved.get("ask_confirmation") and resolved.get("suggestion"):
                suggestion_name = resolved.get("suggestion")
                prod = self._fetch_product_by_name(suggestion_name, brand=resp.brand)
                return {
                    "success": False,
                    "query_type": "CART_ADD",
                    "action": "ask_confirmation",
                    "suggestion": self._row_to_dict(prod) if prod else {"name": suggestion_name},
                    "message": f"Do you mean '{suggestion_name}'?",
                    "confidence": resp.confidence,
                }

            # 5) Fallback: show similar products
            sims = self.llm_service.search_similar(name, self.products, limit=5)
            similar_names = [s[0] for s in sims]
            prods = self._fetch_products_by_names(similar_names, limit=5, brand=resp.brand)
            return {
                "success": False,
                "query_type": "CART_ADD",
                "action": "show_similar",
                "similar": [self._row_to_dict(p) for p in prods],
                "message": f"Couldn't find '{name}' — showing similar options.",
                "confidence": resp.confidence,
            }

        # PRODUCT_SEARCH: show all brands/variants of a specific product
        if qt == "PRODUCT_SEARCH":
            name = (resp.product_name or "").strip()
            if not name:
                return {
                    "success": False,
                    "query_type": "PRODUCT_SEARCH",
                    "action": "no_product",
                    "message": "Please specify which product you'd like to see.",
                    "confidence": resp.confidence,
                }
            # Search by product name (partial match) to get all brands
            query = self.db.query(models.Product).filter(
                models.Product.product.ilike(f"%{name}%")
            )
            # If brand is specified, filter by it too
            if resp.brand:
                query = query.filter(models.Product.brand.ilike(f"%{resp.brand}%"))
            products = query.order_by(models.Product.sale_price.asc()).limit(20).all()

            if products:
                # Group info for the message
                brands_found = list(set(p.brand for p in products if p.brand))
                brand_text = ", ".join(brands_found[:10]) if brands_found else "various"
                return {
                    "success": True,
                    "query_type": "PRODUCT_SEARCH",
                    "action": "display_products",
                    "products": [self._row_to_dict(p) for p in products],
                    "message": f"Found {len(products)} '{name}' products from brands: {brand_text}",
                    "confidence": resp.confidence,
                }
            return {
                "success": False,
                "query_type": "PRODUCT_SEARCH",
                "action": "not_found",
                "message": f"No products found matching '{name}'.",
                "confidence": resp.confidence,
            }

        # PRICE_FILTER: show products above/below/between a price range
        if qt == "PRICE_FILTER":
            query = self.db.query(models.Product)

            # Optionally filter by product name
            if resp.product_name:
                query = query.filter(
                    models.Product.product.ilike(f"%{resp.product_name.strip()}%")
                )
            # Optionally filter by category
            if resp.category:
                query = query.filter(
                    models.Product.category.ilike(f"%{resp.category.strip()}%")
                )

            # Apply price bounds
            min_price = resp.min_price
            max_price = resp.max_price
            if min_price is not None:
                query = query.filter(models.Product.sale_price >= min_price)
            if max_price is not None:
                query = query.filter(models.Product.sale_price <= max_price)

            products = query.order_by(models.Product.sale_price.asc()).limit(20).all()

            # Build a human-friendly message
            price_desc_parts = []
            if min_price is not None:
                price_desc_parts.append(f"above ₹{min_price}")
            if max_price is not None:
                price_desc_parts.append(f"below ₹{max_price}")
            price_desc = " and ".join(price_desc_parts) if price_desc_parts else "in your range"

            product_label = resp.product_name or "products"

            if products:
                return {
                    "success": True,
                    "query_type": "PRICE_FILTER",
                    "action": "display_products",
                    "products": [self._row_to_dict(p) for p in products],
                    "message": f"Found {len(products)} {product_label} {price_desc}",
                    "confidence": resp.confidence,
                }
            return {
                "success": False,
                "query_type": "PRICE_FILTER",
                "action": "not_found",
                "message": f"No {product_label} found {price_desc}.",
                "confidence": resp.confidence,
            }

        # CHECKOUT or UNKNOWN
        if qt == "CHECKOUT":
            return {"success": True, "query_type": "CHECKOUT", "action": "initiate_checkout", "message": "Starting checkout", "confidence": resp.confidence}

        return {"success": False, "query_type": "UNKNOWN", "message": "Unable to classify query", "confidence": resp.confidence}


def create_agent(llm_service, db: Session, categories: List[str], products: List[str]) -> SimpleShoppingAgent:
    """Factory: returns a DB-aware SimpleShoppingAgent."""
    return SimpleShoppingAgent(llm_service, db, categories, products)
