from typing import Tuple
from app.services.assessment.base_service import BaseScoringService, ColorResult


class PitcherOnBaseUScoringService(BaseScoringService):
    """Pitcher OnBaseU assessment scoring service."""

    def score_result(self, result: str) -> Tuple[int, ColorResult]:
        """Score a Pitcher OnBaseU test result.

        Args:
            result: The test result string (e.g., 'Pass', 'Neutral', 'Fail')

        Returns:
            Tuple of (score, color)
        """
        score = self.result_to_score(result)
        color = self.score_to_color(score)
        return score, color

    def calculate_category_score(self, results: list) -> float:
        """Calculate average score for a category."""
        if not results:
            return 0.0

        total_score = sum(r.get("score", 0) for r in results)
        max_score = len(results) * 3

        return (total_score / max_score) * 100 if max_score > 0 else 0.0

    def calculate_overall_score(self, results: list) -> Tuple[float, ColorResult]:
        """Calculate overall assessment score."""
        percentage = self.calculate_category_score(results)
        color = self.percentage_to_color(percentage)
        return percentage, color

    def check_asymmetry(self, left_result: str, right_result: str) -> bool:
        """Check if there's an asymmetry between left and right results."""
        left_score = self.result_to_score(left_result)
        right_score = self.result_to_score(right_result)
        return left_score != right_score

    def analyze_throwing_arm_vs_glove_arm(
        self, results: list, throws: str
    ) -> dict:
        """Analyze differences between throwing arm and glove arm.

        Args:
            results: List of result dictionaries with 'side' and 'score' keys
            throws: 'R' or 'L' for throwing hand

        Returns:
            Dictionary with analysis results
        """
        throwing_arm = "right" if throws == "R" else "left"
        glove_arm = "left" if throws == "R" else "right"

        throwing_results = [r for r in results if r.get("side") == throwing_arm]
        glove_results = [r for r in results if r.get("side") == glove_arm]

        throwing_avg = self.calculate_category_score(throwing_results)
        glove_avg = self.calculate_category_score(glove_results)

        return {
            "throwing_arm_score": throwing_avg,
            "glove_arm_score": glove_avg,
            "difference": abs(throwing_avg - glove_avg),
            "imbalance_detected": abs(throwing_avg - glove_avg) > 15,
        }
