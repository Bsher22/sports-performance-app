from typing import Optional, List, Dict, Any
from datetime import date
from sqlalchemy.orm import Session
from uuid import UUID

from app.models import Player, AssessmentSession, OnBaseUResult, PitcherOnBaseUResult, TPIPowerResult, SprintResult, KAMSResult
from app.services.assessment import (
    OnBaseUScoringService,
    PitcherOnBaseUScoringService,
    TPIPowerScoringService,
    SprintScoringService,
    KAMSScoringService,
)


class PlayerAnalysisService:
    """Service for player analysis and progress tracking."""

    def __init__(self, db: Session):
        self.db = db
        self.onbaseu_scoring = OnBaseUScoringService()
        self.pitcher_onbaseu_scoring = PitcherOnBaseUScoringService()
        self.tpi_scoring = TPIPowerScoringService()
        self.sprint_scoring = SprintScoringService()
        self.kams_scoring = KAMSScoringService()

    def get_player_progress(
        self,
        player_id: UUID,
        assessment_type: str,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> Dict[str, Any]:
        """Get player progress data over time."""
        query = self.db.query(AssessmentSession).filter(
            AssessmentSession.player_id == player_id,
            AssessmentSession.assessment_type == assessment_type,
            AssessmentSession.is_complete == True,
        )

        if start_date:
            query = query.filter(AssessmentSession.assessment_date >= start_date)
        if end_date:
            query = query.filter(AssessmentSession.assessment_date <= end_date)

        sessions = query.order_by(AssessmentSession.assessment_date).all()

        progress_data = []
        for session in sessions:
            results = self._get_session_results(session)
            scores = self._calculate_scores(assessment_type, results)

            progress_data.append({
                "date": session.assessment_date.isoformat(),
                "session_id": str(session.id),
                "scores": scores,
                "overall_score": scores.get("overall", 0),
            })

        # Calculate trend
        trend = self._calculate_trend(progress_data)

        return {
            "player_id": str(player_id),
            "assessment_type": assessment_type,
            "progress_data": progress_data,
            "trend": trend,
            "total_assessments": len(sessions),
        }

    def get_player_summary(self, player_id: UUID) -> Dict[str, Any]:
        """Get comprehensive player assessment summary."""
        player = self.db.query(Player).filter(Player.id == player_id).first()
        if not player:
            return {}

        summary = {
            "player_id": str(player_id),
            "player_name": player.full_name,
            "team_name": player.team.name if player.team else None,
            "assessments": {},
        }

        # Get latest assessment for each type
        assessment_types = ["onbaseu", "pitcher_onbaseu", "tpi_power", "sprint", "kams"]

        for assess_type in assessment_types:
            latest = (
                self.db.query(AssessmentSession)
                .filter(
                    AssessmentSession.player_id == player_id,
                    AssessmentSession.assessment_type == assess_type,
                    AssessmentSession.is_complete == True,
                )
                .order_by(AssessmentSession.assessment_date.desc())
                .first()
            )

            if latest:
                results = self._get_session_results(latest)
                scores = self._calculate_scores(assess_type, results)

                summary["assessments"][assess_type] = {
                    "latest_date": latest.assessment_date.isoformat(),
                    "overall_score": scores.get("overall", 0),
                    "category_scores": scores.get("categories", {}),
                    "color": scores.get("color", "red"),
                }

        return summary

    def compare_players(
        self,
        player_ids: List[UUID],
        assessment_type: str,
        as_of_date: Optional[date] = None,
    ) -> Dict[str, Any]:
        """Compare multiple players on an assessment."""
        comparison_data = {}

        for player_id in player_ids:
            query = self.db.query(AssessmentSession).filter(
                AssessmentSession.player_id == player_id,
                AssessmentSession.assessment_type == assessment_type,
                AssessmentSession.is_complete == True,
            )

            if as_of_date:
                query = query.filter(AssessmentSession.assessment_date <= as_of_date)

            session = query.order_by(AssessmentSession.assessment_date.desc()).first()

            if session:
                player = self.db.query(Player).filter(Player.id == player_id).first()
                results = self._get_session_results(session)
                scores = self._calculate_scores(assessment_type, results)

                comparison_data[str(player_id)] = {
                    "player_name": player.full_name if player else "Unknown",
                    "team_name": player.team.name if player and player.team else None,
                    "assessment_date": session.assessment_date.isoformat(),
                    "overall_score": scores.get("overall", 0),
                    "category_scores": scores.get("categories", {}),
                    "color": scores.get("color", "red"),
                }

        # Rank players
        rankings = sorted(
            comparison_data.items(),
            key=lambda x: x[1]["overall_score"],
            reverse=True,
        )

        return {
            "assessment_type": assessment_type,
            "comparison_data": comparison_data,
            "rankings": [{"player_id": pid, "rank": i + 1} for i, (pid, _) in enumerate(rankings)],
        }

    def _get_session_results(self, session: AssessmentSession) -> List[Dict]:
        """Get results for a session based on assessment type."""
        if session.assessment_type == "onbaseu":
            return [self._result_to_dict(r) for r in session.onbaseu_results]
        elif session.assessment_type == "pitcher_onbaseu":
            return [self._result_to_dict(r) for r in session.pitcher_onbaseu_results]
        elif session.assessment_type == "tpi_power":
            return [self._result_to_dict(r) for r in session.tpi_power_results]
        elif session.assessment_type == "sprint":
            return [self._result_to_dict(r) for r in session.sprint_results]
        elif session.assessment_type == "kams":
            return [self._result_to_dict(r) for r in session.kams_results]
        return []

    def _result_to_dict(self, result) -> Dict:
        """Convert a result model to dictionary."""
        return {k: v for k, v in result.__dict__.items() if not k.startswith("_")}

    def _calculate_scores(self, assessment_type: str, results: List[Dict]) -> Dict[str, Any]:
        """Calculate scores based on assessment type."""
        if assessment_type == "onbaseu":
            overall, color = self.onbaseu_scoring.calculate_overall_score(results)
            return {
                "overall": overall,
                "color": color,
                "categories": self._group_by_category(results, "test_category"),
            }
        elif assessment_type == "pitcher_onbaseu":
            overall, color = self.pitcher_onbaseu_scoring.calculate_overall_score(results)
            return {
                "overall": overall,
                "color": color,
                "categories": self._group_by_category(results, "test_category"),
            }
        elif assessment_type == "tpi_power":
            overall, color = self.tpi_scoring.calculate_overall_score(results)
            return {"overall": overall, "color": color, "categories": {}}
        elif assessment_type == "sprint":
            overall, color = self.sprint_scoring.calculate_overall_score(results)
            categories = self.sprint_scoring.calculate_category_scores(results)
            return {"overall": overall, "color": color, "categories": categories}
        elif assessment_type == "kams":
            overall, color = self.kams_scoring.calculate_overall_assessment_score(results)
            return {"overall": overall, "color": color, "categories": {}}

        return {"overall": 0, "color": "red", "categories": {}}

    def _group_by_category(self, results: List[Dict], category_key: str) -> Dict[str, float]:
        """Group results by category and calculate average scores."""
        categories = {}
        for result in results:
            cat = result.get(category_key)
            if cat:
                if cat not in categories:
                    categories[cat] = []
                categories[cat].append(result.get("score", 0))

        return {
            cat: sum(scores) / len(scores) / 3 * 100 if scores else 0
            for cat, scores in categories.items()
        }

    def _calculate_trend(self, progress_data: List[Dict]) -> Dict[str, Any]:
        """Calculate trend from progress data."""
        if len(progress_data) < 2:
            return {"direction": "stable", "change": 0}

        first_score = progress_data[0]["overall_score"]
        last_score = progress_data[-1]["overall_score"]
        change = last_score - first_score

        if change > 5:
            direction = "improving"
        elif change < -5:
            direction = "declining"
        else:
            direction = "stable"

        return {
            "direction": direction,
            "change": round(change, 2),
            "first_score": first_score,
            "last_score": last_score,
        }
