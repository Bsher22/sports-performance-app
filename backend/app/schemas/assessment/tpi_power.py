from pydantic import BaseModel
from typing import Optional, Literal, List
from datetime import datetime
from uuid import UUID


class TPIPowerTestDefinition(BaseModel):
    code: str
    name: str
    category: str
    is_bilateral: bool
    result_type: Literal["numeric"]
    unit: str
    description: Optional[str] = None


class TPIPowerResultBase(BaseModel):
    test_code: str
    test_name: str
    result_value: float
    side: Optional[Literal["left", "right"]] = None
    notes: Optional[str] = None


class TPIPowerResultCreate(TPIPowerResultBase):
    pass


class TPIPowerResultUpdate(BaseModel):
    result_value: Optional[float] = None
    notes: Optional[str] = None


class TPIPowerResultResponse(TPIPowerResultBase):
    id: UUID
    session_id: UUID
    score_percentage: Optional[float] = None
    color: Optional[Literal["blue", "green", "yellow", "red"]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TPIPowerBulkCreate(BaseModel):
    results: List[TPIPowerResultCreate]


# TPI Power Test Configuration
TPI_POWER_TESTS: List[TPIPowerTestDefinition] = [
    TPIPowerTestDefinition(
        code="TPI-01",
        name="Vertical Jump",
        category="lower_body_power",
        is_bilateral=False,
        result_type="numeric",
        unit="inches",
        description="Standing vertical jump height measurement",
    ),
    TPIPowerTestDefinition(
        code="TPI-02",
        name="Broad Jump",
        category="lower_body_power",
        is_bilateral=False,
        result_type="numeric",
        unit="inches",
        description="Standing broad jump distance measurement",
    ),
    TPIPowerTestDefinition(
        code="TPI-03",
        name="Seated Chest Pass",
        category="upper_body_power",
        is_bilateral=False,
        result_type="numeric",
        unit="inches",
        description="Seated medicine ball chest pass distance",
    ),
    TPIPowerTestDefinition(
        code="TPI-04",
        name="Sit Up Throw",
        category="core_power",
        is_bilateral=False,
        result_type="numeric",
        unit="inches",
        description="Medicine ball throw from sit-up position",
    ),
    TPIPowerTestDefinition(
        code="TPI-05",
        name="Baseline Shot Put",
        category="rotational_power",
        is_bilateral=True,
        result_type="numeric",
        unit="inches",
        description="Rotational shot put throw from baseline stance",
    ),
]

# TPI Scoring Thresholds
TPI_SCORING_THRESHOLDS = {
    "Vertical Jump": {"blue": 30, "green": 26, "yellow": 22},
    "Broad Jump": {"blue": 114, "green": 108, "yellow": 96},
    "Seated Chest Pass": {"factor": 0.85},  # % of vertical jump
    "Sit Up Throw": {"factor": 0.85},  # % of vertical jump
    "Baseline Shot Put": {"factor": 1.5, "off_side_factor": 0.9},  # % of vertical jump
}
