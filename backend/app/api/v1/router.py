from fastapi import APIRouter
from app.api.v1 import auth, users, teams, players
from app.api.v1.assessments.router import router as assessments_router
from app.api.v1.analysis.router import router as analysis_router

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(teams.router, prefix="/teams", tags=["Teams"])
api_router.include_router(players.router, prefix="/players", tags=["Players"])
api_router.include_router(assessments_router, prefix="/assessments", tags=["Assessments"])
api_router.include_router(analysis_router, prefix="/analysis", tags=["Analysis"])
