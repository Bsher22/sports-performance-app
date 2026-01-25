from typing import Tuple, Optional
from app.services.assessment.base_service import BaseScoringService, ColorResult


class SprintScoringService(BaseScoringService):
    """Sprint assessment scoring service."""

    THRESHOLDS = {
        "81 ft Sprint": {"optimal": 2.80, "adequate": 3.00},
        "5-yard Directional - Left": {"optimal": 1.10, "adequate": 1.25},
        "5-yard Directional - Center": {"optimal": 1.05, "adequate": 1.20},
        "5-yard Directional - Right": {"optimal": 1.10, "adequate": 1.25},
        "Curvilinear Sprint": {"optimal": 2.00, "adequate": 2.20},
    }

    def score_result(
        self, test_name: str, time: float
    ) -> Tuple[Optional[float], Optional[ColorResult]]:
        """Score a sprint test result.

        Args:
            test_name: Name of the test
            time: Best time in seconds

        Returns:
            Tuple of (percentage, color) or (None, None) if test not found
        """
        thresholds = self.THRESHOLDS.get(test_name)
        if not thresholds:
            return None, None

        optimal = thresholds["optimal"]
        adequate = thresholds["adequate"]

        if time <= optimal:
            # At or better than optimal
            return 100.0, "green"
        elif time <= adequate:
            # Between optimal and adequate - linear interpolation
            range_size = adequate - optimal
            time_from_optimal = time - optimal
            percentage = 85 + (1 - time_from_optimal / range_size) * 15
            return percentage, "yellow"
        else:
            # Below adequate - scale down from 70
            overage = (time - adequate) / adequate
            percentage = max(0, 70 - overage * 100)
            return percentage, "red"

    def calculate_category_scores(self, results: list) -> dict:
        """Calculate scores by sprint category.

        Args:
            results: List of result dictionaries

        Returns:
            Dictionary with category scores
        """
        categories = {
            "linear": [],
            "directional": [],
            "curvilinear": [],
        }

        for result in results:
            category = result.get("test_category")
            if category and result.get("score_percentage") is not None:
                categories[category].append(result["score_percentage"])

        scores = {}
        for category, percentages in categories.items():
            if percentages:
                avg = sum(percentages) / len(percentages)
                scores[category] = {
                    "score": avg,
                    "color": self.percentage_to_color(avg),
                }
            else:
                scores[category] = {"score": None, "color": None}

        return scores

    def calculate_overall_score(self, results: list) -> Tuple[float, ColorResult]:
        """Calculate overall sprint score.

        Args:
            results: List of result dictionaries

        Returns:
            Tuple of (average_percentage, color)
        """
        valid_results = [r for r in results if r.get("score_percentage") is not None]

        if not valid_results:
            return 0.0, "red"

        avg_percentage = sum(r["score_percentage"] for r in valid_results) / len(valid_results)
        color = self.percentage_to_color(avg_percentage)

        return avg_percentage, color

    def analyze_directional_balance(self, results: list) -> dict:
        """Analyze balance between directional sprint directions.

        Args:
            results: List of result dictionaries

        Returns:
            Analysis dictionary
        """
        left = next(
            (r for r in results if r.get("test_name") == "5-yard Directional - Left"),
            None,
        )
        right = next(
            (r for r in results if r.get("test_name") == "5-yard Directional - Right"),
            None,
        )
        center = next(
            (r for r in results if r.get("test_name") == "5-yard Directional - Center"),
            None,
        )

        analysis = {
            "left_time": left.get("best_time") if left else None,
            "right_time": right.get("best_time") if right else None,
            "center_time": center.get("best_time") if center else None,
            "imbalance_detected": False,
            "imbalance_direction": None,
        }

        if left and right and left.get("best_time") and right.get("best_time"):
            left_time = float(left["best_time"])
            right_time = float(right["best_time"])
            diff = abs(left_time - right_time)

            # Consider > 0.1 second difference as an imbalance
            if diff > 0.1:
                analysis["imbalance_detected"] = True
                analysis["imbalance_direction"] = "left" if left_time > right_time else "right"
                analysis["time_difference"] = diff

        return analysis
