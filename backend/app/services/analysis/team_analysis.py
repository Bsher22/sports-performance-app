from typing import Optional, List, Dict, Any
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models import Player, Team, AssessmentSession
from app.services.analysis.player_analysis import PlayerAnalysisService


class TeamAnalysisService:
    """Service for team-level analysis."""

    def __init__(self, db: Session):
        self.db = db
        self.player_analysis = PlayerAnalysisService(db)

    def get_team_overview(self, team_id: int) -> Dict[str, Any]:
        """Get comprehensive team overview."""
        team = self.db.query(Team).filter(Team.id == team_id).first()
        if not team:
            return {}

        # Get all active players
        players = (
            self.db.query(Player)
            .filter(Player.team_id == team_id, Player.is_active == True)
            .all()
        )

        # Get assessment counts by type
        assessment_counts = (
            self.db.query(
                AssessmentSession.assessment_type,
                func.count(AssessmentSession.id),
            )
            .join(Player)
            .filter(Player.team_id == team_id)
            .group_by(AssessmentSession.assessment_type)
            .all()
        )

        # Calculate team averages for each assessment type
        team_averages = {}
        assessment_types = ["onbaseu", "pitcher_onbaseu", "tpi_power", "sprint", "kams"]

        for assess_type in assessment_types:
            scores = []
            for player in players:
                summary = self.player_analysis.get_player_summary(player.id)
                if assess_type in summary.get("assessments", {}):
                    score = summary["assessments"][assess_type].get("overall_score", 0)
                    scores.append(score)

            if scores:
                team_averages[assess_type] = {
                    "average": sum(scores) / len(scores),
                    "player_count": len(scores),
                    "min": min(scores),
                    "max": max(scores),
                }

        return {
            "team_id": team_id,
            "team_name": team.name,
            "organization": team.organization,
            "player_count": len(players),
            "pitchers": len([p for p in players if p.is_pitcher]),
            "position_players": len([p for p in players if p.is_position_player]),
            "assessment_counts": dict(assessment_counts),
            "team_averages": team_averages,
        }

    def get_team_trends(
        self,
        team_id: int,
        assessment_type: str,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
    ) -> Dict[str, Any]:
        """Get team performance trends over time."""
        team = self.db.query(Team).filter(Team.id == team_id).first()
        if not team:
            return {}

        # Get all sessions for team players
        query = (
            self.db.query(AssessmentSession)
            .join(Player)
            .filter(
                Player.team_id == team_id,
                AssessmentSession.assessment_type == assessment_type,
                AssessmentSession.is_complete == True,
            )
        )

        if start_date:
            query = query.filter(AssessmentSession.assessment_date >= start_date)
        if end_date:
            query = query.filter(AssessmentSession.assessment_date <= end_date)

        sessions = query.order_by(AssessmentSession.assessment_date).all()

        # Group by date and calculate daily averages
        date_scores = {}
        for session in sessions:
            date_str = session.assessment_date.isoformat()
            results = self.player_analysis._get_session_results(session)
            scores = self.player_analysis._calculate_scores(assessment_type, results)

            if date_str not in date_scores:
                date_scores[date_str] = []
            date_scores[date_str].append(scores.get("overall", 0))

        # Calculate daily averages
        trend_data = []
        for date_str, scores in sorted(date_scores.items()):
            trend_data.append({
                "date": date_str,
                "average_score": sum(scores) / len(scores),
                "assessment_count": len(scores),
            })

        # Calculate overall trend
        if len(trend_data) >= 2:
            first_avg = trend_data[0]["average_score"]
            last_avg = trend_data[-1]["average_score"]
            change = last_avg - first_avg

            if change > 5:
                direction = "improving"
            elif change < -5:
                direction = "declining"
            else:
                direction = "stable"

            trend = {
                "direction": direction,
                "change": round(change, 2),
            }
        else:
            trend = {"direction": "stable", "change": 0}

        return {
            "team_id": team_id,
            "team_name": team.name,
            "assessment_type": assessment_type,
            "trend_data": trend_data,
            "trend": trend,
        }

    def get_player_rankings(
        self,
        team_id: int,
        assessment_type: str,
    ) -> Dict[str, Any]:
        """Get player rankings within a team for an assessment type."""
        team = self.db.query(Team).filter(Team.id == team_id).first()
        if not team:
            return {}

        players = (
            self.db.query(Player)
            .filter(Player.team_id == team_id, Player.is_active == True)
            .all()
        )

        player_scores = []
        for player in players:
            # Get latest assessment
            session = (
                self.db.query(AssessmentSession)
                .filter(
                    AssessmentSession.player_id == player.id,
                    AssessmentSession.assessment_type == assessment_type,
                    AssessmentSession.is_complete == True,
                )
                .order_by(AssessmentSession.assessment_date.desc())
                .first()
            )

            if session:
                results = self.player_analysis._get_session_results(session)
                scores = self.player_analysis._calculate_scores(assessment_type, results)

                player_scores.append({
                    "player_id": str(player.id),
                    "player_name": player.full_name,
                    "overall_score": scores.get("overall", 0),
                    "assessment_date": session.assessment_date.isoformat(),
                })

        # Sort by score descending
        player_scores.sort(key=lambda x: x["overall_score"], reverse=True)

        # Add ranks
        for i, player in enumerate(player_scores):
            player["rank"] = i + 1

        return {
            "team_id": team_id,
            "team_name": team.name,
            "assessment_type": assessment_type,
            "rankings": player_scores,
            "total_players": len(player_scores),
        }
