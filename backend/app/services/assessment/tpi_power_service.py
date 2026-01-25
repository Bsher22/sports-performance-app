from typing import Tuple, Optional
from app.services.assessment.base_service import BaseScoringService, ColorResult


class TPIPowerScoringService(BaseScoringService):
    """TPI Power assessment scoring service."""

    THRESHOLDS = {
        "Vertical Jump": {"blue": 30, "green": 26, "yellow": 22},
        "Broad Jump": {"blue": 114, "green": 108, "yellow": 96},
    }

    RELATIVE_THRESHOLDS = {
        "Seated Chest Pass": 0.85,
        "Sit Up Throw": 0.85,
        "Baseline Shot Put": 1.5,
    }

    OFF_SIDE_FACTOR = 0.9

    def score_result(
        self,
        test_name: str,
        value: float,
        vertical_jump: Optional[float] = None,
        is_off_side: bool = False,
    ) -> Tuple[Optional[float], Optional[ColorResult]]:
        """Score a TPI Power test result.

        Args:
            test_name: Name of the test
            value: Measured value in inches
            vertical_jump: Vertical jump value for relative scoring
            is_off_side: Whether this is the off-side (non-dominant) for shot put

        Returns:
            Tuple of (percentage, color) or (None, None) if can't be scored
        """
        if test_name == "Vertical Jump":
            return self._score_vertical_jump(value)
        elif test_name == "Broad Jump":
            return self._score_broad_jump(value)
        elif test_name in self.RELATIVE_THRESHOLDS:
            if vertical_jump is None:
                return None, None
            return self._score_relative_test(test_name, value, vertical_jump, is_off_side)

        return None, None

    def _score_vertical_jump(self, value: float) -> Tuple[float, ColorResult]:
        """Score vertical jump test."""
        thresholds = self.THRESHOLDS["Vertical Jump"]

        if value >= thresholds["blue"]:
            return 100.0, "blue"
        elif value >= thresholds["green"]:
            # Interpolate between green and blue
            range_size = thresholds["blue"] - thresholds["green"]
            position = value - thresholds["green"]
            percentage = 85.0 + (position / range_size) * 15
            return percentage, "green"
        elif value >= thresholds["yellow"]:
            # Interpolate between yellow and green
            range_size = thresholds["green"] - thresholds["yellow"]
            position = value - thresholds["yellow"]
            percentage = 70.0 + (position / range_size) * 15
            return percentage, "yellow"
        else:
            # Below yellow threshold
            percentage = max(0, (value / thresholds["yellow"]) * 70)
            return percentage, "red"

    def _score_broad_jump(self, value: float) -> Tuple[float, ColorResult]:
        """Score broad jump test."""
        thresholds = self.THRESHOLDS["Broad Jump"]

        if value >= thresholds["blue"]:
            return 100.0, "blue"
        elif value >= thresholds["green"]:
            range_size = thresholds["blue"] - thresholds["green"]
            position = value - thresholds["green"]
            percentage = 85.0 + (position / range_size) * 15
            return percentage, "green"
        elif value >= thresholds["yellow"]:
            range_size = thresholds["green"] - thresholds["yellow"]
            position = value - thresholds["yellow"]
            percentage = 70.0 + (position / range_size) * 15
            return percentage, "yellow"
        else:
            percentage = max(0, (value / thresholds["yellow"]) * 70)
            return percentage, "red"

    def _score_relative_test(
        self,
        test_name: str,
        value: float,
        vertical_jump: float,
        is_off_side: bool = False,
    ) -> Tuple[float, ColorResult]:
        """Score tests relative to vertical jump.

        Args:
            test_name: Name of the test
            value: Measured value in inches
            vertical_jump: Vertical jump value for comparison
            is_off_side: Whether this is the off-side for shot put

        Returns:
            Tuple of (percentage, color)
        """
        threshold = self.RELATIVE_THRESHOLDS[test_name]

        # Adjust threshold for off-side shot put
        if is_off_side and test_name == "Baseline Shot Put":
            threshold *= self.OFF_SIDE_FACTOR

        # Calculate target value based on vertical jump
        target = vertical_jump * threshold

        # Calculate percentage
        percentage = (value / target) * 100 if target > 0 else 0
        percentage = min(percentage, 100.0)

        color = self.percentage_to_color(percentage, include_blue=True)
        return percentage, color

    def calculate_overall_score(self, results: list) -> Tuple[float, ColorResult]:
        """Calculate overall TPI Power score.

        Args:
            results: List of result dictionaries with 'score_percentage' key

        Returns:
            Tuple of (average_percentage, color)
        """
        valid_results = [r for r in results if r.get("score_percentage") is not None]

        if not valid_results:
            return 0.0, "red"

        avg_percentage = sum(r["score_percentage"] for r in valid_results) / len(valid_results)
        color = self.percentage_to_color(avg_percentage, include_blue=True)

        return avg_percentage, color
