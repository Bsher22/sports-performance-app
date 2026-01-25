from pydantic import BaseModel
from typing import Optional, Literal, List
from datetime import datetime
from uuid import UUID


class SprintTestDefinition(BaseModel):
    code: str
    name: str
    category: Literal["linear", "directional", "curvilinear"]
    result_type: Literal["time"]
    unit: str = "seconds"
    description: Optional[str] = None


class SprintResultBase(BaseModel):
    test_code: str
    test_name: str
    test_category: Literal["linear", "directional", "curvilinear"]
    shoe_type: Optional[str] = None
    surface_type: Optional[str] = None
    run_1_time: Optional[float] = None
    run_2_time: Optional[float] = None
    run_3_time: Optional[float] = None
    notes: Optional[str] = None


class SprintResultCreate(SprintResultBase):
    pass


class SprintResultUpdate(BaseModel):
    shoe_type: Optional[str] = None
    surface_type: Optional[str] = None
    run_1_time: Optional[float] = None
    run_2_time: Optional[float] = None
    run_3_time: Optional[float] = None
    notes: Optional[str] = None


class SprintResultResponse(SprintResultBase):
    id: UUID
    session_id: UUID
    best_time: Optional[float] = None
    score_percentage: Optional[float] = None
    color: Optional[Literal["green", "yellow", "red"]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SprintBulkCreate(BaseModel):
    results: List[SprintResultCreate]


# Sprint Test Configuration
SPRINT_TESTS: List[SprintTestDefinition] = [
    SprintTestDefinition(
        code="SPR-01",
        name="81 ft Sprint",
        category="linear",
        result_type="time",
        unit="seconds",
        description="Straight-line sprint over 81 feet (baseline to baseline)",
    ),
    SprintTestDefinition(
        code="SPR-02",
        name="5-yard Directional - Left",
        category="directional",
        result_type="time",
        unit="seconds",
        description="5-yard directional sprint to the left",
    ),
    SprintTestDefinition(
        code="SPR-03",
        name="5-yard Directional - Center",
        category="directional",
        result_type="time",
        unit="seconds",
        description="5-yard directional sprint straight ahead",
    ),
    SprintTestDefinition(
        code="SPR-04",
        name="5-yard Directional - Right",
        category="directional",
        result_type="time",
        unit="seconds",
        description="5-yard directional sprint to the right",
    ),
    SprintTestDefinition(
        code="SPR-05",
        name="Curvilinear Sprint",
        category="curvilinear",
        result_type="time",
        unit="seconds",
        description="Curved sprint path simulating base running",
    ),
]

# Sprint Scoring Thresholds
SPRINT_THRESHOLDS = {
    "81 ft Sprint": {"optimal": 2.80, "adequate": 3.00},
    "5-yard Directional - Left": {"optimal": 1.10, "adequate": 1.25},
    "5-yard Directional - Center": {"optimal": 1.05, "adequate": 1.20},
    "5-yard Directional - Right": {"optimal": 1.10, "adequate": 1.25},
    "Curvilinear Sprint": {"optimal": 2.00, "adequate": 2.20},
}
