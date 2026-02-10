from difflib import SequenceMatcher, get_close_matches
from typing import List, Tuple, Optional


def similarity(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    a_clean = a.lower().strip()
    b_clean = b.lower().strip()
    return SequenceMatcher(None, a_clean, b_clean).ratio()


def find_similar_products(name: str, products: List[str], limit: int = 5) -> List[Tuple[str, float]]:
    """Return up to `limit` products most similar to `name` with similarity scores."""
    scores = []
    for p in products:
        scores.append((p, similarity(name, p)))
    scores.sort(key=lambda x: x[1], reverse=True)
    return scores[:limit]


def match_or_suggest(name: str, products: List[str], exact_threshold: float = 0.95, suggest_threshold: float = 0.6) -> Tuple[Optional[str], Optional[str], float]:
    """
    Try to find an exact or high-confidence match. Returns (matched, suggestion, score).
    - If a very close match >= exact_threshold is found return it as matched (suggestion None).
    - If the best match is between suggest_threshold and exact_threshold return (None, suggestion, score).
    - If nothing >= suggest_threshold return (None, None, best_score).
    """
    if not name or not products:
        return None, None, 0.0
    best = None
    best_score = 0.0
    for p in products:
        s = similarity(name, p)
        if s > best_score:
            best_score = s
            best = p

    if best_score >= exact_threshold:
        return best, None, best_score
    if best_score >= suggest_threshold:
        return None, best, best_score
    return None, None, best_score
