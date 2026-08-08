def calculate_budget_limits(budget: float):
    """
    Calculate deterministic budget allocations matching frontend categories.
    """
    return {
        "venue": round(budget * 0.25, 2),
        "catering": round(budget * 0.35, 2),
        "decoration": round(budget * 0.15, 2),
        "cake": round(budget * 0.07, 2),
        "activities": round(budget * 0.08, 2),
        "contingency": round(budget * 0.10, 2),
        "total": round(budget, 2),
    }