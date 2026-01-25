from typing import Tuple
from app.services.assessment.base_service import BaseScoringService, ColorResult


class OnBaseUScoringService(BaseScoringService):
    """OnBaseU assessment scoring service."""

    def score_result(self, result: str) -> Tuple[int, ColorResult]:
        """Score an OnBaseU test result.

        Args:
            result: The test result string (e.g., 'Pass', 'Neutral', 'Fail')

        Returns:
            Tuple of (score, color)
        """
        score = self.result_to_score(result)
        color = self.score_to_color(score)
        return score, color

    def calculate_category_score(self, results: list) -> float:
        """Calculate average score for a category.

        Args:
            results: List of result dictionaries with 'score' key

        Returns:
            Average score as percentage (0-100)
        """
        if not results:
            return 0.0

        total_score = sum(r.get("score", 0) for r in results)
        max_score = len(results) * 3  # Max score is 3 per test

        return (total_score / max_score) * 100 if max_score > 0 else 0.0

    def calculate_overall_score(self, results: list) -> Tuple[float, ColorResult]:
        """Calculate overall assessment score.

        Args:
            results: List of all result dictionaries

        Returns:
            Tuple of (percentage, color)
        """
        percentage = self.calculate_category_score(results)
        color = self.percentage_to_color(percentage)
        return percentage, color

    def check_asymmetry(self, left_result: str, right_result: str) -> bool:
        """Check if there's an asymmetry between left and right results.

        Args:
            left_result: Left side result
            right_result: Right side result

        Returns:
            True if there's asymmetry (different results)
        """
        left_score = self.result_to_score(left_result)
        right_score = self.result_to_score(right_result)
        return left_score != right_score
