"""Expert registry — hardcoded for now, DB-backed later."""

from app.utils.exceptions import NotFoundError

EXPERTS = [
    {
        "id": "general",
        "name": "General Assistant",
        "description": "A general-purpose assistant for everyday questions.",
    },
    {
        "id": "code",
        "name": "Code Expert",
        "description": "Specializes in programming and software engineering.",
    },
    {
        "id": "math",
        "name": "Math Expert",
        "description": "Specializes in mathematics and quantitative reasoning.",
    },
]


def list_experts() -> list[dict]:
    return EXPERTS


def get_expert(expert_id: str) -> dict:
    for expert in EXPERTS:
        if expert["id"] == expert_id:
            return expert
    raise NotFoundError(detail=f"Expert '{expert_id}' not found")


def select_expert(message: str) -> dict:
    """Simple keyword-based routing. Replace with classifier later."""
    lower = message.lower()
    if any(kw in lower for kw in ("code", "program", "function", "bug", "python", "java")):
        return get_expert("code")
    if any(kw in lower for kw in ("math", "calcul", "equation", "integral", "solve")):
        return get_expert("math")
    return get_expert("general")
