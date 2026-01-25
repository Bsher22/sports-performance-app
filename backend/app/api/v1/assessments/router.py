from fastapi import APIRouter
from app.api.v1.assessments import sessions, onbaseu, pitcher_onbaseu, tpi_power, sprint, kams

router = APIRouter()

router.include_router(sessions.router, prefix="/sessions", tags=["Assessment Sessions"])
router.include_router(onbaseu.router, prefix="/onbaseu", tags=["OnBaseU"])
router.include_router(pitcher_onbaseu.router, prefix="/pitcher-onbaseu", tags=["Pitcher OnBaseU"])
router.include_router(tpi_power.router, prefix="/tpi-power", tags=["TPI Power"])
router.include_router(sprint.router, prefix="/sprint", tags=["Sprint"])
router.include_router(kams.router, prefix="/kams", tags=["KAMS"])
