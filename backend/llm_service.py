"""
Groq-compatible LLM service.

This module provides a lightweight client to call a Groq-hosted LLM API (or any HTTP LLM endpoint)
and parse structured JSON output that the model is asked to produce. The service validates
responses against the `BotResponse` pydantic model.

Configuration (environment variables expected in `backend/.env`):
- `LLM_PROVIDER` (optional): set to `groq` to use Groq. Default is `groq`.
- `GROQ_API_URL`: The Groq LLM HTTP endpoint URL.
- `GROQ_API_KEY`: Authorization key for the Groq API.
"""

from typing import Optional, List
import os
import re
import json
import requests
from dotenv import load_dotenv

from .llm_schemas import BotResponse, QueryType
from .utils import find_similar_products, match_or_suggest

load_dotenv()


class ChatbotLLMService:
    def __init__(self, provider: str = None, temperature: float = 0.3):
        self.provider = provider or os.getenv("LLM_PROVIDER", "groq").lower()
        self.temperature = temperature

        if self.provider == "groq":
            self.api_url = os.getenv("GROQ_API_URL")
            self.api_key = os.getenv("GROQ_API_KEY")
            if not self.api_url or not self.api_key:
                raise ValueError("GROQ_API_URL and GROQ_API_KEY must be set in environment for Groq provider")
        else:
            raise ValueError(f"Unsupported LLM provider: {self.provider}")

    def _invoke_groq(self, prompt: str) -> Optional[str]:
        """Call the Groq LLM endpoint (OpenAI-compatible) with a prompt."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        # Ensure URL points to chat/completions if using standard base URL
        url = self.api_url
        if url.endswith("/v1"):
            url = f"{url}/chat/completions"
        elif not url.endswith("/chat/completions"):
             # If user provided bare domain, assume standard path
             url = f"{url.rstrip('/')}/openai/v1/chat/completions"

        # Prepare messages
        messages = [
            {"role": "system", "content": "You are a helpful API assistant that outputs strict JSON only. Do not output any markdown formatting like ```json ... ```."},
            {"role": "user", "content": prompt}
        ]

        payload = {
            "model": "llama-3.3-70b-versatile", 
            "messages": messages,
            "temperature": self.temperature,
            "max_tokens": 1024,
            "response_format": {"type": "json_object"}
        }
        
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=30)
            resp.raise_for_status()
            data = resp.json()

            return data['choices'][0]['message']['content']
        except Exception as e:
            print(f"Error calling Groq API: {e} - Response: {resp.text if 'resp' in locals() else 'None'}")
            return None


    def _extract_json_from_text(self, text: str) -> Optional[dict]:
        if not text:
            return None
        # Try to locate a JSON object in the model output
        m = re.search(r"\{[\s\S]*\}", text)
        if not m:
            return None
        try:
            return json.loads(m.group())
        except Exception:
            # Last resort: try to clean trailing commas etc.
            cleaned = re.sub(r",\s*}\s*$", "}", m.group())
            try:
                return json.loads(cleaned)
            except Exception:
                return None

    def parse_user_query(self, user_message: str) -> Optional[BotResponse]:
        prompt = f"""
You are a supermarket shopping assistant. Analyze the user's message and determine what action they want.

Available action types:
1. PRICE_QUERY: User asks about the price of a product
2. CART_ADD: User wants to add items to their cart
3. CATEGORY_FILTER: User wants to see products from a specific category
4. CHECKOUT: User wants to buy items, checkout, or place order
5. UNKNOWN: Message doesn't match any above categories

User Message: {user_message}

Return a JSON object with the following fields exactly:
- query_type: One of ["PRICE_QUERY","CART_ADD","CATEGORY_FILTER","CHECKOUT","UNKNOWN"]
- action: short action string
- product_name: or null
- brand: or null
- quantity: or null
- category: or null
- weight: or null
- confidence: float between 0 and 1

Examples:
User: "What is the price of tomato today?"
Response: {{"query_type":"PRICE_QUERY","action":"fetch_price","product_name":"tomato","quantity":null,"category":null,"weight":null,"confidence":0.95}}

User: "Add 5 tomatoes to the cart"
Response: {{"query_type":"CART_ADD","action":"add_to_cart","product_name":"tomato","brand":null,"quantity":5,"category":null,"weight":null,"confidence":0.95}}
User: "Show me Hero banana"
Response: {{"query_type":"PRICE_QUERY","action":"fetch_price","product_name":"banana","brand":"Hero","quantity":null,"category":null,"weight":null,"confidence":0.95}}
"""

        raw = self._invoke_groq(prompt)
        parsed = self._extract_json_from_text(raw) if raw else None
        if not parsed:
            print("LLM returned no JSON or unparsable output:\n", raw)
            return None
        try:
            return BotResponse.parse_obj(parsed)
        except Exception as e:
            print(f"BotResponse validation failed: {e} - parsed: {parsed}")
            return None

    def parse_with_context(self, user_message: str, available_categories: List[str], available_products: List[str]) -> Optional[BotResponse]:
        categories_str = ", ".join(available_categories[:20])
        products_str = ", ".join(available_products[:15])

        prompt = f"""
You are a supermarket shopping assistant. Available categories: {categories_str}
Sample products: {products_str}

User Message: {user_message}

Return a JSON object with strictly these fields:
- query_type: MUST be one of ["PRICE_QUERY", "CART_ADD", "CATEGORY_FILTER", "PRODUCT_SEARCH", "PRICE_FILTER", "CHECKOUT", "UNKNOWN"] (UPPERCASE)
- action: string
- product_name: string or null
- brand: string or null
- quantity: number or null
- category: string or null
- weight: string or null
- min_price: number or null (minimum price threshold the user wants)
- max_price: number or null (maximum price threshold the user wants)
- confidence: number

IMPORTANT RULES for query_type selection:
- Use PRODUCT_SEARCH when the user wants to see/show/browse a specific product type across all brands. Examples: "show me rice", "I want to see milk", "what toothpaste do you have", "show me all shampoo"
- Use PRICE_FILTER when the user asks to see products above/below/between a certain price. Examples: "show products above 150", "items under 200", "products between 100 and 500"
- Use PRICE_QUERY when the user asks for the price of one specific product (e.g. "what is the price of Amul butter")
- Use CART_ADD when the user explicitly wants to add to cart
- Use CATEGORY_FILTER when the user mentions a broad category like "beauty", "dairy", "grocery"

Examples:
{{"query_type": "PRICE_QUERY", "action": "check_price", "product_name": "Tomato", "brand": null, "quantity": null, "category": null, "weight": null, "min_price": null, "max_price": null, "confidence": 0.9}}
{{"query_type": "PRODUCT_SEARCH", "action": "search_product", "product_name": "rice", "brand": null, "quantity": null, "category": null, "weight": null, "min_price": null, "max_price": null, "confidence": 0.95}}
{{"query_type": "PRODUCT_SEARCH", "action": "search_product", "product_name": "shampoo", "brand": null, "quantity": null, "category": null, "weight": null, "min_price": null, "max_price": null, "confidence": 0.9}}
{{"query_type": "PRICE_FILTER", "action": "filter_by_price", "product_name": null, "brand": null, "quantity": null, "category": null, "weight": null, "min_price": 150, "max_price": null, "confidence": 0.95}}
{{"query_type": "PRICE_FILTER", "action": "filter_by_price", "product_name": "rice", "brand": null, "quantity": null, "category": null, "weight": null, "min_price": 150, "max_price": null, "confidence": 0.9}}
{{"query_type": "PRICE_FILTER", "action": "filter_by_price", "product_name": null, "brand": null, "quantity": null, "category": null, "weight": null, "min_price": null, "max_price": 200, "confidence": 0.9}}
"""
        raw = self._invoke_groq(prompt)
        parsed = self._extract_json_from_text(raw) if raw else None
        if not parsed:
            print("LLM (context) returned no JSON or unparsable output:\n", raw)
            return None
        try:
            return BotResponse.parse_obj(parsed)
        except Exception as e:
            print(f"BotResponse validation failed (context): {e} - parsed: {parsed}")
            return None

    def extract_entities(self, user_message: str) -> dict:
        prompt = f"""
Extract entities from this shopping query and return a JSON object with keys: product_name, quantity, category, weight, keyword.
User Message: {user_message}
"""
        raw = self._invoke_groq(prompt)
        parsed = self._extract_json_from_text(raw) if raw else None
        return parsed or {}

    # ----- Product matching & suggestion helpers -----
    def resolve_product_name(self, product_name: str, available_products: List[str]):
        """
        Try to resolve a user-provided product name against the available products.
        Returns a dict with keys: matched (exact), suggestion (if any), score, ask_confirmation (bool)
        """
        matched, suggestion, score = match_or_suggest(product_name or "", available_products)
        result = {"matched": matched, "suggestion": suggestion, "score": score}
        # Ask confirmation if only a suggestion is available
        result["ask_confirmation"] = True if (matched is None and suggestion is not None) else False
        return result

    def search_similar(self, product_name: str, available_products: List[str], limit: int = 5):
        """Return list of similar products with score."""
        return find_similar_products(product_name or "", available_products, limit=limit)

