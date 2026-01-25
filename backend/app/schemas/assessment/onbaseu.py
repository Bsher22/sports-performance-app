from pydantic import BaseModel
from typing import Optional, Literal, List
from datetime import datetime
from uuid import UUID


class OnBaseUTestDefinition(BaseModel):
    code: str
    name: str
    category: str
    subcategory: Optional[str] = None
    is_bilateral: bool
    result_type: Literal["select", "numeric"]
    options: Optional[List[str]] = None
    description: Optional[str] = None


class OnBaseUResultBase(BaseModel):
    test_code: str
    test_name: str
    test_category: str
    subcategory: Optional[str] = None
    side: Optional[Literal["left", "right"]] = None
    result: str
    notes: Optional[str] = None


class OnBaseUResultCreate(OnBaseUResultBase):
    pass


class OnBaseUResultUpdate(BaseModel):
    result: Optional[str] = None
    notes: Optional[str] = None


class OnBaseUResultResponse(OnBaseUResultBase):
    id: UUID
    session_id: UUID
    score: int
    color: Literal["green", "yellow", "red"]
    created_at: datetime

    class Config:
        from_attributes = True


class OnBaseUBulkCreate(BaseModel):
    results: List[OnBaseUResultCreate]


# OnBaseU Test Configuration
ONBASEU_TESTS: List[OnBaseUTestDefinition] = [
    # Upper Body - Shoulder Mobility
    OnBaseUTestDefinition(
        code="OBU-01",
        name="Shoulder 46 Test",
        category="upper_body",
        subcategory="shoulder_mobility",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    OnBaseUTestDefinition(
        code="OBU-02",
        name="90/90 Test",
        category="upper_body",
        subcategory="shoulder_mobility",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    OnBaseUTestDefinition(
        code="OBU-03",
        name="Lat Test",
        category="upper_body",
        subcategory="shoulder_mobility",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    OnBaseUTestDefinition(
        code="OBU-04",
        name="Hitchhiker Test",
        category="upper_body",
        subcategory="upper_body_control",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    # Lower Body - Hip Mobility
    OnBaseUTestDefinition(
        code="OBU-05",
        name="Hip 45 Test",
        category="lower_body",
        subcategory="hip_mobility",
        is_bilateral=True,
        result_type="select",
        options=["> 45°", "= 45°", "< 45°"],
    ),
    OnBaseUTestDefinition(
        code="OBU-06",
        name="Pelvic Tilt Test",
        category="lower_body",
        subcategory="hip_mobility",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    OnBaseUTestDefinition(
        code="OBU-07",
        name="Pelvic Rotation Test",
        category="lower_body",
        subcategory="hip_mobility",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    # Lower Body - Control
    OnBaseUTestDefinition(
        code="OBU-08",
        name="Deep Squat Test",
        category="lower_body",
        subcategory="lower_body_control",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Improves with Holding", "Fail"],
    ),
    OnBaseUTestDefinition(
        code="OBU-09",
        name="Hurdle Step Test",
        category="lower_body",
        subcategory="lower_body_control",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    OnBaseUTestDefinition(
        code="OBU-10",
        name="MSR",
        category="lower_body",
        subcategory="lower_body_control",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    # Lower Body - Foot & Ankle
    OnBaseUTestDefinition(
        code="OBU-11",
        name="Toe Tap Test",
        category="lower_body",
        subcategory="foot_ankle",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    OnBaseUTestDefinition(
        code="OBU-12",
        name="Ankle Rocking Test",
        category="lower_body",
        subcategory="foot_ankle",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    # Core - Power & Stability
    OnBaseUTestDefinition(
        code="OBU-13",
        name="Push-Off Test",
        category="core",
        subcategory="power_stability",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    OnBaseUTestDefinition(
        code="OBU-14",
        name="Separation Test",
        category="core",
        subcategory="power_stability",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    # Core - Rotational Control
    OnBaseUTestDefinition(
        code="OBU-15",
        name="Holding Angle Test",
        category="core",
        subcategory="rotational_control",
        is_bilateral=False,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
    OnBaseUTestDefinition(
        code="OBU-16",
        name="Seated Trunk Rotation Test",
        category="core",
        subcategory="rotational_control",
        is_bilateral=True,
        result_type="select",
        options=["Pass", "Neutral", "Fail"],
    ),
]
