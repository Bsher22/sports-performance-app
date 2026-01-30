# Adding a New Assessment Type to TigerTrain

This guide provides step-by-step instructions for adding a completely new assessment type to the system.

## Overview

To add a new assessment type (e.g., `vertical_jump_test`), you need to create/modify files in both the backend and frontend:

**Backend (8 files):**
1. Model file (database table)
2. Schema file (API validation)
3. Service file (scoring logic)
4. API router file (endpoints)
5. Register model in `__init__.py`
6. Add relationship in `assessment.py`
7. Register router in `router.py`
8. Update `AssessmentType` in `session.py`

**Frontend (2 files):**
1. Update types in `assessment.ts`
2. Create API client file

---

## Step 1: Create the Database Model

**File:** `backend/app/models/{assessment_name}.py`

```python
from sqlalchemy import Column, String, Text, DateTime, ForeignKey, UniqueConstraint, CheckConstraint, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
from app.db.base import Base


class NewAssessmentResult(Base):
    """New Assessment Results."""

    __tablename__ = "new_assessment_results"
    __table_args__ = (
        UniqueConstraint(
            "session_id", "test_code", "side", name="uq_new_assessment_session_test_side"
        ),
        CheckConstraint(
            "color IN ('blue', 'green', 'yellow', 'red')", name="ck_new_assessment_color_valid"
        ),
        {"schema": "assessments"},
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(
        UUID(as_uuid=True),
        ForeignKey("assessments.sessions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    test_code = Column(String(20), nullable=False)
    test_name = Column(String(100), nullable=False)

    # Assessment-specific measurement fields
    result_value = Column(Numeric(10, 2), nullable=False)  # For numeric measurements
    # OR for select-based: result = Column(String(20), nullable=False)  # Pass/Neutral/Fail

    side = Column(String(10), nullable=True)  # 'left', 'right', or null for non-bilateral

    # Computed scoring
    score = Column(Numeric(5, 2), nullable=True)  # Raw score (1-3) or percentage
    color = Column(String(10), nullable=True)  # green/yellow/red/blue

    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship back to session
    session = relationship("AssessmentSession", back_populates="new_assessment_results")
```

---

## Step 2: Create the Pydantic Schemas

**File:** `backend/app/schemas/assessment/{assessment_name}.py`

```python
from pydantic import BaseModel
from typing import Optional, Literal, List
from datetime import datetime
from uuid import UUID


class NewAssessmentTestDefinition(BaseModel):
    code: str
    name: str
    category: str
    is_bilateral: bool
    result_type: Literal["numeric", "select", "time"]
    unit: Optional[str] = None  # e.g., "inches", "seconds"
    options: Optional[List[str]] = None  # For select type: ["Pass", "Neutral", "Fail"]
    description: Optional[str] = None


class NewAssessmentResultBase(BaseModel):
    test_code: str
    test_name: str
    result_value: float  # OR result: str for select-based
    side: Optional[Literal["left", "right"]] = None
    notes: Optional[str] = None


class NewAssessmentResultCreate(NewAssessmentResultBase):
    pass


class NewAssessmentResultUpdate(BaseModel):
    result_value: Optional[float] = None
    notes: Optional[str] = None


class NewAssessmentResultResponse(NewAssessmentResultBase):
    id: UUID
    session_id: UUID
    score: Optional[float] = None
    color: Optional[Literal["blue", "green", "yellow", "red"]] = None
    created_at: datetime

    class Config:
        from_attributes = True


class NewAssessmentBulkCreate(BaseModel):
    results: List[NewAssessmentResultCreate]


# Define your test configuration
NEW_ASSESSMENT_TESTS: List[NewAssessmentTestDefinition] = [
    NewAssessmentTestDefinition(
        code="NA-01",
        name="Test Name 1",
        category="category_name",
        is_bilateral=False,
        result_type="numeric",
        unit="inches",
        description="Description of test 1",
    ),
    NewAssessmentTestDefinition(
        code="NA-02",
        name="Test Name 2",
        category="category_name",
        is_bilateral=True,  # Has left/right sides
        result_type="numeric",
        unit="seconds",
        description="Description of test 2",
    ),
    # Add more tests...
]

# Optional: Define scoring thresholds
NEW_ASSESSMENT_THRESHOLDS = {
    "Test Name 1": {"blue": 100, "green": 85, "yellow": 70},
    "Test Name 2": {"blue": 5.0, "green": 6.0, "yellow": 7.0},  # For time (lower is better)
}
```

---

## Step 3: Create the Scoring Service

**File:** `backend/app/services/assessment/{assessment_name}_service.py`

```python
from typing import Tuple, Optional
from app.services.assessment.base_service import BaseScoringService, ColorResult


class NewAssessmentScoringService(BaseScoringService):
    """Scoring service for new assessment type."""

    THRESHOLDS = {
        "Test Name 1": {"blue": 100, "green": 85, "yellow": 70},
        "Test Name 2": {"blue": 5.0, "green": 6.0, "yellow": 7.0},
    }

    def score_result(
        self,
        test_name: str,
        value: float,
        **kwargs  # Additional context if needed
    ) -> Tuple[Optional[float], Optional[ColorResult]]:
        """Score a single test result.

        Args:
            test_name: Name of the test
            value: Measured value

        Returns:
            Tuple of (score/percentage, color) or (None, None) if can't score
        """
        if test_name not in self.THRESHOLDS:
            return None, None

        thresholds = self.THRESHOLDS[test_name]

        # For "higher is better" tests:
        if value >= thresholds["blue"]:
            return 100.0, "blue"
        elif value >= thresholds["green"]:
            return 85.0, "green"
        elif value >= thresholds["yellow"]:
            return 70.0, "yellow"
        else:
            return 50.0, "red"

        # For "lower is better" tests (like time):
        # if value <= thresholds["blue"]:
        #     return 100.0, "blue"
        # etc.

    def calculate_overall_score(self, results: list) -> Tuple[float, ColorResult]:
        """Calculate overall assessment score.

        Args:
            results: List of result dictionaries with 'score' key

        Returns:
            Tuple of (average_score, color)
        """
        valid_results = [r for r in results if r.get("score") is not None]

        if not valid_results:
            return 0.0, "red"

        avg_score = sum(r["score"] for r in valid_results) / len(valid_results)
        color = self.percentage_to_color(avg_score, include_blue=True)

        return avg_score, color
```

---

## Step 4: Create the API Router

**File:** `backend/app/api/v1/assessments/{assessment_name}.py`

```python
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.api.deps import get_db, get_current_active_user
from app.core.exceptions import NotFoundException, BadRequestException
from app.models import AssessmentSession
from app.models.new_assessment import NewAssessmentResult
from app.schemas.assessment.new_assessment import (
    NewAssessmentResultCreate,
    NewAssessmentResultUpdate,
    NewAssessmentResultResponse,
    NewAssessmentBulkCreate,
    NewAssessmentTestDefinition,
    NEW_ASSESSMENT_TESTS,
)
from app.services.assessment.new_assessment_service import NewAssessmentScoringService

router = APIRouter()
scoring_service = NewAssessmentScoringService()


@router.get("/tests", response_model=List[NewAssessmentTestDefinition])
def get_test_definitions(
    current_user=Depends(get_current_active_user),
):
    """Get all test definitions for this assessment type."""
    return NEW_ASSESSMENT_TESTS


@router.get("/{session_id}/results", response_model=List[NewAssessmentResultResponse])
def get_session_results(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Get all results for a session."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "new_assessment",
    ).first()

    if not session:
        raise NotFoundException("Session not found or wrong assessment type")

    return session.new_assessment_results


@router.post("/{session_id}/results", response_model=NewAssessmentResultResponse, status_code=status.HTTP_201_CREATED)
def create_result(
    session_id: UUID,
    result_data: NewAssessmentResultCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create a single result."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "new_assessment",
    ).first()

    if not session:
        raise NotFoundException("Session not found or wrong assessment type")

    # Check for duplicate
    existing = db.query(NewAssessmentResult).filter(
        NewAssessmentResult.session_id == session_id,
        NewAssessmentResult.test_code == result_data.test_code,
        NewAssessmentResult.side == result_data.side,
    ).first()

    if existing:
        raise BadRequestException("Result already exists for this test/side")

    # Calculate score
    score, color = scoring_service.score_result(
        result_data.test_name,
        float(result_data.result_value),
    )

    result = NewAssessmentResult(
        session_id=session_id,
        **result_data.model_dump(),
        score=score,
        color=color,
    )

    db.add(result)
    db.commit()
    db.refresh(result)

    return result


@router.post("/{session_id}/results/bulk", response_model=List[NewAssessmentResultResponse], status_code=status.HTTP_201_CREATED)
def create_bulk_results(
    session_id: UUID,
    bulk_data: NewAssessmentBulkCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Create multiple results at once."""
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.assessment_type == "new_assessment",
    ).first()

    if not session:
        raise NotFoundException("Session not found or wrong assessment type")

    results = []
    for result_data in bulk_data.results:
        existing = db.query(NewAssessmentResult).filter(
            NewAssessmentResult.session_id == session_id,
            NewAssessmentResult.test_code == result_data.test_code,
            NewAssessmentResult.side == result_data.side,
        ).first()

        if existing:
            continue

        score, color = scoring_service.score_result(
            result_data.test_name,
            float(result_data.result_value),
        )

        result = NewAssessmentResult(
            session_id=session_id,
            **result_data.model_dump(),
            score=score,
            color=color,
        )

        db.add(result)
        results.append(result)

    db.commit()
    for result in results:
        db.refresh(result)

    return results


@router.put("/{session_id}/results/{result_id}", response_model=NewAssessmentResultResponse)
def update_result(
    session_id: UUID,
    result_id: UUID,
    result_update: NewAssessmentResultUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Update a specific result."""
    result = db.query(NewAssessmentResult).filter(
        NewAssessmentResult.id == result_id,
        NewAssessmentResult.session_id == session_id,
    ).first()

    if not result:
        raise NotFoundException("Result not found")

    update_data = result_update.model_dump(exclude_unset=True)

    if "result_value" in update_data:
        score, color = scoring_service.score_result(
            result.test_name,
            float(update_data["result_value"]),
        )
        update_data["score"] = score
        update_data["color"] = color

    for field, value in update_data.items():
        setattr(result, field, value)

    db.commit()
    db.refresh(result)

    return result


@router.delete("/{session_id}/results/{result_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_result(
    session_id: UUID,
    result_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_active_user),
):
    """Delete a specific result."""
    result = db.query(NewAssessmentResult).filter(
        NewAssessmentResult.id == result_id,
        NewAssessmentResult.session_id == session_id,
    ).first()

    if not result:
        raise NotFoundException("Result not found")

    db.delete(result)
    db.commit()
```

---

## Step 5: Register the Model

**File:** `backend/app/models/__init__.py`

Add:
```python
from app.models.new_assessment import NewAssessmentResult

__all__ = [
    # ... existing exports ...
    "NewAssessmentResult",
]
```

---

## Step 6: Add Relationship to AssessmentSession

**File:** `backend/app/models/assessment.py`

Add to the `AssessmentSession` class:
```python
    new_assessment_results = relationship(
        "NewAssessmentResult", back_populates="session", cascade="all, delete-orphan"
    )
```

---

## Step 7: Register the API Router

**File:** `backend/app/api/v1/assessments/router.py`

```python
from app.api.v1.assessments import sessions, onbaseu, pitcher_onbaseu, tpi_power, sprint, kams, new_assessment

router = APIRouter()

# ... existing routers ...
router.include_router(new_assessment.router, prefix="/new-assessment", tags=["New Assessment"])
```

---

## Step 8: Update AssessmentType

**File:** `backend/app/schemas/assessment/session.py`

Update:
```python
AssessmentType = Literal["onbaseu", "pitcher_onbaseu", "tpi_power", "sprint", "kams", "new_assessment"]
```

---

## Step 9: Update Frontend Types

**File:** `frontend/src/types/assessment.ts`

Add to the `AssessmentType` union:
```typescript
export type AssessmentType = 'onbaseu' | 'pitcher_onbaseu' | 'tpi_power' | 'sprint' | 'kams' | 'new_assessment';
```

Add new interfaces:
```typescript
// New Assessment Types
export interface NewAssessmentResult {
  id?: string;
  session_id: string;
  test_code: string;
  test_name: string;
  result_value: number;
  side?: 'left' | 'right' | null;
  score?: number | null;
  color?: ResultColor | null;
  notes?: string | null;
  created_at?: string;
}

export interface NewAssessmentResultCreate {
  test_code: string;
  test_name: string;
  result_value: number;
  side?: 'left' | 'right' | null;
  notes?: string | null;
}
```

---

## Step 10: Create Frontend API Client

**File:** `frontend/src/api/assessments/new-assessment.ts`

```typescript
import apiClient from '../client';
import { NewAssessmentResult, NewAssessmentResultCreate, TestDefinition } from '@/types/assessment';

export const newAssessmentApi = {
  getTests: async (): Promise<TestDefinition[]> => {
    const response = await apiClient.get<TestDefinition[]>('/assessments/new-assessment/tests');
    return response.data;
  },

  getResults: async (sessionId: string): Promise<NewAssessmentResult[]> => {
    const response = await apiClient.get<NewAssessmentResult[]>(`/assessments/new-assessment/${sessionId}/results`);
    return response.data;
  },

  createResult: async (sessionId: string, data: NewAssessmentResultCreate): Promise<NewAssessmentResult> => {
    const response = await apiClient.post<NewAssessmentResult>(
      `/assessments/new-assessment/${sessionId}/results`,
      data
    );
    return response.data;
  },

  createBulkResults: async (sessionId: string, results: NewAssessmentResultCreate[]): Promise<NewAssessmentResult[]> => {
    const response = await apiClient.post<NewAssessmentResult[]>(
      `/assessments/new-assessment/${sessionId}/results/bulk`,
      { results }
    );
    return response.data;
  },

  updateResult: async (
    sessionId: string,
    resultId: string,
    data: Partial<NewAssessmentResultCreate>
  ): Promise<NewAssessmentResult> => {
    const response = await apiClient.put<NewAssessmentResult>(
      `/assessments/new-assessment/${sessionId}/results/${resultId}`,
      data
    );
    return response.data;
  },

  deleteResult: async (sessionId: string, resultId: string): Promise<void> => {
    await apiClient.delete(`/assessments/new-assessment/${sessionId}/results/${resultId}`);
  },
};
```

**File:** `frontend/src/api/assessments/index.ts`

Add:
```typescript
export * from './new-assessment';
```

---

## Step 11: Update formatAssessmentType Utility

**File:** `frontend/src/lib/utils.ts`

Add to the `formatAssessmentType` function:
```typescript
case 'new_assessment':
  return 'New Assessment';
```

---

## Step 12: Add to Sport Configuration (Admin)

After the backend is deployed, use the Settings page to:
1. Edit each sport where this assessment should be available
2. Toggle on the "New Assessment" option

Or modify `backend/app/main.py` in the `create_initial_sports()` function to include `"new_assessment"` in the `available_assessments` array for relevant sports.

---

## Summary Checklist

### Backend Files to Create:
- [ ] `backend/app/models/{assessment_name}.py`
- [ ] `backend/app/schemas/assessment/{assessment_name}.py`
- [ ] `backend/app/services/assessment/{assessment_name}_service.py`
- [ ] `backend/app/api/v1/assessments/{assessment_name}.py`

### Backend Files to Modify:
- [ ] `backend/app/models/__init__.py` - Add import and export
- [ ] `backend/app/models/assessment.py` - Add relationship
- [ ] `backend/app/api/v1/assessments/router.py` - Register router
- [ ] `backend/app/schemas/assessment/session.py` - Update AssessmentType

### Frontend Files to Create:
- [ ] `frontend/src/api/assessments/{assessment-name}.ts`

### Frontend Files to Modify:
- [ ] `frontend/src/types/assessment.ts` - Add type and interfaces
- [ ] `frontend/src/api/assessments/index.ts` - Add export
- [ ] `frontend/src/lib/utils.ts` - Add to formatAssessmentType

### Configuration:
- [ ] Add assessment type to sports via Settings page

---

## Information Needed From You

When you want to add a new assessment, provide me with:

1. **Assessment Name** (e.g., "Functional Movement Screen")
2. **Assessment Code** (e.g., "fms" - lowercase, no spaces)
3. **List of Tests** with:
   - Test code (e.g., "FMS-01")
   - Test name (e.g., "Deep Squat")
   - Category (e.g., "mobility", "stability")
   - Is it bilateral (left/right sides)?
   - Result type: numeric, select (Pass/Neutral/Fail), or time
   - Unit if numeric (inches, seconds, etc.)
   - Description
4. **Scoring Logic**:
   - For numeric: What thresholds for green/yellow/red/blue?
   - For select: What maps to what score?
   - Higher is better or lower is better?
5. **Which sports** should have access to this assessment?

With this information, I can generate all the necessary code for you.
