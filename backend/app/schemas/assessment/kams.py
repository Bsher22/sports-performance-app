from pydantic import BaseModel
from typing import Optional, Literal, Dict, Any, List
from datetime import datetime
from uuid import UUID


class KAMSTestDefinition(BaseModel):
    test_type: str
    name: str
    description: Optional[str] = None
    measurement_fields: List[str]


class KAMSResultBase(BaseModel):
    test_type: Literal["rom", "squat", "lunge", "balance", "jump"]
    measurements: Dict[str, Any]
    notes: Optional[str] = None


class KAMSResultCreate(KAMSResultBase):
    pass


class KAMSResultUpdate(BaseModel):
    measurements: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None


class KAMSResultResponse(KAMSResultBase):
    id: UUID
    session_id: UUID
    overall_score: Optional[float] = None
    symmetry_score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


class KAMSBulkCreate(BaseModel):
    results: List[KAMSResultCreate]


class KAMSPDFUpload(BaseModel):
    player_id: UUID
    assessment_date: str  # YYYY-MM-DD format


# KAMS Test Configuration
KAMS_TESTS: List[KAMSTestDefinition] = [
    KAMSTestDefinition(
        test_type="rom",
        name="Multi-Segmental ROM",
        description="Range of Motion assessment across multiple body segments",
        measurement_fields=[
            "hip_flexion_left",
            "hip_flexion_right",
            "hip_extension_left",
            "hip_extension_right",
            "hip_internal_rotation_left",
            "hip_internal_rotation_right",
            "hip_external_rotation_left",
            "hip_external_rotation_right",
            "ankle_dorsiflexion_left",
            "ankle_dorsiflexion_right",
            "shoulder_flexion_left",
            "shoulder_flexion_right",
            "shoulder_extension_left",
            "shoulder_extension_right",
            "thoracic_rotation_left",
            "thoracic_rotation_right",
        ],
    ),
    KAMSTestDefinition(
        test_type="squat",
        name="Overhead Squat",
        description="Functional squat assessment with arms overhead",
        measurement_fields=[
            "depth_score",
            "knee_tracking",
            "torso_angle",
            "arm_position",
            "heel_rise",
            "overall_quality",
        ],
    ),
    KAMSTestDefinition(
        test_type="lunge",
        name="Reverse Lunge",
        description="Single-leg lunge pattern assessment",
        measurement_fields=[
            "depth_left",
            "depth_right",
            "knee_tracking_left",
            "knee_tracking_right",
            "balance_left",
            "balance_right",
            "overall_quality_left",
            "overall_quality_right",
        ],
    ),
    KAMSTestDefinition(
        test_type="balance",
        name="Single Leg Balance",
        description="Single leg stability assessment",
        measurement_fields=[
            "time_left",
            "time_right",
            "sway_left",
            "sway_right",
            "compensations_left",
            "compensations_right",
        ],
    ),
    KAMSTestDefinition(
        test_type="jump",
        name="Vertical Jump",
        description="Vertical jump landing mechanics assessment",
        measurement_fields=[
            "height",
            "landing_quality",
            "knee_valgus",
            "asymmetry",
            "force_absorption",
        ],
    ),
]
