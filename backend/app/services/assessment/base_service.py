from typing import Literal, Tuple, Optional

ColorResult = Literal["green", "yellow", "red", "blue"]


class BaseScoringService:
    """Base scoring service with common functionality."""

    RESULT_TO_SCORE = {
        "Pass": 3,
        "Good": 3,
        "> 45°": 3,
        "Neutral": 2,
        "= 45°": 2,
        "Improves with Holding": 2,
        "Limited": 1,
        "< 45°": 1,
        "Short": 1,
        "No Change": 1,
        "Fail": 1,
    }

    def result_to_score(self, result: str) -> int:
        """Convert text result to numeric score (1-3)."""
        return self.RESULT_TO_SCORE.get(result, 1)

    def score_to_color(self, score: int) -> ColorResult:
        """Convert score to color."""
        if score >= 3:
            return "green"
        elif score >= 2:
            return "yellow"
        return "red"

    def percentage_to_color(self, percentage: float, include_blue: bool = False) -> ColorResult:
        """Convert percentage to color."""
        if include_blue and percentage >= 100:
            return "blue"
        if percentage >= 85:
            return "green"
        elif percentage >= 70:
            return "yellow"
        return "red"
