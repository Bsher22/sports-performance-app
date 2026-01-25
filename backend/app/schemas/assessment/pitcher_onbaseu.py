from pydantic import BaseModel
from typing import Optional, Literal, List
from datetime import datetime
from uuid import UUID


class PitcherOnBaseUTestDefinition(BaseModel):
    code: str
    name: str
    category: str
    subcategory: Optional[str] = None
    is_bilateral: bool
    result_type: Literal["select", "numeric"]
    options: Optional[List[str]] = None
    description: Optional[str] = None


class PitcherOnBaseUResultBase(BaseModel):
    test_code: str
    test_name: str
    test_category: str
    subcategory: Optional[str] = None
    side: Optional[Literal["left", "right"]] = None
    result: str
    notes: Optional[str] = None


class PitcherOnBaseUResultCreate(PitcherOnBaseUResultBase):
    pass


class PitcherOnBaseUResultUpdate(BaseModel):
    result: Optional[str] = None
    notes: Optional[str] = None


class PitcherOnBaseUResultResponse(PitcherOnBaseUResultBase):
    id: UUID
    session_id: UUID
    score: int
    color: Literal["green", "yellow", "red"]
    created_at: datetime

    class Config:
        from_attributes = True


class PitcherOnBaseUBulkCreate(BaseModel):
    results: List[PitcherOnBaseUResultCreate]


# Pitcher OnBaseU Test Configuration
PITCHER_ONBASEU_TESTS: List[PitcherOnBaseUTestDefinition] = [
    # Upper Body - Shoulder Mobility (Pitcher-specific)
    PitcherOnBaseUTestDefinition(
        code="POBU-01",
        name="Shoulder 46 Test",
        category="upper_body",
        subcategory="shoulder_mobility",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    PitcherOnBaseUTestDefinition(
        code="POBU-02",
        name="90/90 Test",
        category="upper_body",
        subcategory="shoulder_mobility",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    PitcherOnBaseUTestDefinition(
        code="POBU-03",
        name="Lat Test",
        category="upper_body",
        subcategory="shoulder_mobility",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    PitcherOnBaseUTestDefinition(
        code="POBU-04",
        name="Hitchhiker Test",
        category="upper_body",
        subcategory="upper_body_control",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    # Lower Body - Hip Mobility
    PitcherOnBaseUTestDefinition(
        code="POBU-05",
        name="Hip 45 Test",
        category="lower_body",
        subcategory="hip_mobility",
        is_bilateral=True,
        result_type="select",
        options=["> 45°", "= 45°", "< 45°"],
    ),
    PitcherOnBaseUTestDefinition(
        code="POBU-06",
        name="Pelvic Tilt Test",
        category="lower_body",
        subcategory="hip_mobility",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    PitcherOnBaseUTestDefinition(
        code="POBU-07",
        name="Pelvic Rotation Test",
        category="lower_body",
        subcategory="hip_mobility",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    # Lower Body - Control
    PitcherOnBaseUTestDefinition(
        code="POBU-08",
        name="Deep Squat Test",
        category="lower_body",
        subcategory="lower_body_control",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Improves with Holding", "Fail"],
    ),
    PitcherOnBaseUTestDefinition(
        code="POBU-09",
        name="Hurdle Step Test",
        category="lower_body",
        subcategory="lower_body_control",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    PitcherOnBaseUTestDefinition(
        code="POBU-10",
        name="MSR",
        category="lower_body",
        subcategory="lower_body_control",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    # Lower Body - Foot & Ankle
    PitcherOnBaseUTestDefinition(
        code="POBU-11",
        name="Toe Tap Test",
        category="lower_body",
        subcategory="foot_ankle",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    PitcherOnBaseUTestDefinition(
        code="POBU-12",
        name="Ankle Rocking Test",
        category="lower_body",
        subcategory="foot_ankle",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    # Core - Power & Stability
    PitcherOnBaseUTestDefinition(
        code="POBU-13",
        name="Push-Off Test",
        category="core",
        subcategory="power_stability",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    PitcherOnBaseUTestDefinition(
        code="POBU-14",
        name="Separation Test",
        category="core",
        subcategory="power_stability",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    # Core - Rotational Control
    PitcherOnBaseUTestDefinition(
        code="POBU-15",
        name="Holding Angle Test",
        category="core",
        subcategory="rotational_control",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    PitcherOnBaseUTestDefinition(
        code="POBU-16",
        name="Seated Trunk Rotation Test",
        category="core",
        subcategory="rotational_control",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
]
