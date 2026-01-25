from typing import Tuple, Optional, Dict, Any
from app.services.assessment.base_service import BaseScoringService, ColorResult


class KAMSScoringService(BaseScoringService):
    """KAMS assessment scoring service."""

    def score_result(
        self, test_type: str, measurements: Dict[str, Any]
    ) -> Tuple[Optional[float], Optional[float]]:
        """Score a KAMS test result.

        Args:
            test_type: Type of KAMS test (rom, squat, lunge, balance, jump)
            measurements: Dictionary of measurements

        Returns:
            Tuple of (overall_score, symmetry_score) - both as percentages
        """
        if test_type == "rom":
            return self._score_rom(measurements)
        elif test_type == "squat":
            return self._score_squat(measurements)
        elif test_type == "lunge":
            return self._score_lunge(measurements)
        elif test_type == "balance":
            return self._score_balance(measurements)
        elif test_type == "jump":
            return self._score_jump(measurements)

        return None, None

    def _score_rom(self, measurements: Dict[str, Any]) -> Tuple[float, float]:
        """Score ROM test.

        Args:
            measurements: ROM measurement dictionary

        Returns:
            Tuple of (overall_score, symmetry_score)
        """
        # Extract left/right pairs for symmetry calculation
        pairs = [
            ("hip_flexion_left", "hip_flexion_right"),
            ("hip_extension_left", "hip_extension_right"),
            ("hip_internal_rotation_left", "hip_internal_rotation_right"),
            ("hip_external_rotation_left", "hip_external_rotation_right"),
            ("ankle_dorsiflexion_left", "ankle_dorsiflexion_right"),
            ("shoulder_flexion_left", "shoulder_flexion_right"),
            ("shoulder_extension_left", "shoulder_extension_right"),
            ("thoracic_rotation_left", "thoracic_rotation_right"),
        ]

        symmetry_scores = []
        for left_key, right_key in pairs:
            left_val = measurements.get(left_key)
            right_val = measurements.get(right_key)

            if left_val is not None and right_val is not None:
                # Calculate symmetry as percentage (100 = perfectly symmetric)
                max_val = max(left_val, right_val)
                if max_val > 0:
                    symmetry = (min(left_val, right_val) / max_val) * 100
                    symmetry_scores.append(symmetry)

        symmetry_score = sum(symmetry_scores) / len(symmetry_scores) if symmetry_scores else None

        # Overall score - this would typically come from the KAMS PDF
        # For manual entry, we'll calculate based on measurements vs. norms
        overall_score = measurements.get("overall_score", 75.0)

        return overall_score, symmetry_score

    def _score_squat(self, measurements: Dict[str, Any]) -> Tuple[float, float]:
        """Score overhead squat test."""
        # Score components
        components = ["depth_score", "knee_tracking", "torso_angle", "arm_position", "heel_rise"]
        valid_scores = [measurements.get(c) for c in components if measurements.get(c) is not None]

        overall_score = sum(valid_scores) / len(valid_scores) if valid_scores else 0
        overall_score = min(overall_score * 20, 100)  # Assuming 0-5 scale, convert to percentage

        # Squat is bilateral, so symmetry is not directly applicable
        symmetry_score = None
        overall_quality = measurements.get("overall_quality")
        if overall_quality is not None:
            overall_score = overall_quality * 20

        return overall_score, symmetry_score

    def _score_lunge(self, measurements: Dict[str, Any]) -> Tuple[float, float]:
        """Score reverse lunge test."""
        # Calculate left and right scores
        left_components = ["depth_left", "knee_tracking_left", "balance_left", "overall_quality_left"]
        right_components = ["depth_right", "knee_tracking_right", "balance_right", "overall_quality_right"]

        left_scores = [measurements.get(c) for c in left_components if measurements.get(c) is not None]
        right_scores = [measurements.get(c) for c in right_components if measurements.get(c) is not None]

        left_avg = sum(left_scores) / len(left_scores) if left_scores else 0
        right_avg = sum(right_scores) / len(right_scores) if right_scores else 0

        overall_score = ((left_avg + right_avg) / 2) * 20  # Convert to percentage

        # Calculate symmetry
        if left_avg > 0 and right_avg > 0:
            symmetry_score = (min(left_avg, right_avg) / max(left_avg, right_avg)) * 100
        else:
            symmetry_score = None

        return overall_score, symmetry_score

    def _score_balance(self, measurements: Dict[str, Any]) -> Tuple[float, float]:
        """Score single leg balance test."""
        left_time = measurements.get("time_left", 0)
        right_time = measurements.get("time_right", 0)

        # Score based on time (assume 30 seconds is perfect)
        left_score = min((left_time / 30) * 100, 100) if left_time else 0
        right_score = min((right_time / 30) * 100, 100) if right_time else 0

        overall_score = (left_score + right_score) / 2

        # Symmetry based on time difference
        if left_time > 0 and right_time > 0:
            symmetry_score = (min(left_time, right_time) / max(left_time, right_time)) * 100
        else:
            symmetry_score = None

        return overall_score, symmetry_score

    def _score_jump(self, measurements: Dict[str, Any]) -> Tuple[float, float]:
        """Score vertical jump landing mechanics test."""
        components = ["landing_quality", "force_absorption"]
        deductions = ["knee_valgus", "asymmetry"]

        # Start with base score
        base_score = 100

        # Add component scores
        for comp in components:
            val = measurements.get(comp)
            if val is not None:
                base_score = min(base_score, val * 20)  # Assuming 0-5 scale

        # Apply deductions
        for ded in deductions:
            val = measurements.get(ded)
            if val is not None and val > 0:
                base_score -= val * 5  # Deduct based on severity

        overall_score = max(0, base_score)

        # Asymmetry score from measurements
        asymmetry = measurements.get("asymmetry", 0)
        symmetry_score = max(0, 100 - asymmetry * 10) if asymmetry is not None else None

        return overall_score, symmetry_score

    def calculate_overall_assessment_score(
        self, results: list
    ) -> Tuple[float, ColorResult]:
        """Calculate overall KAMS assessment score.

        Args:
            results: List of result dictionaries

        Returns:
            Tuple of (average_percentage, color)
        """
        valid_scores = [r.get("overall_score") for r in results if r.get("overall_score") is not None]

        if not valid_scores:
            return 0.0, "red"

        avg_score = sum(valid_scores) / len(valid_scores)
        color = self.percentage_to_color(avg_score)

        return avg_score, color
