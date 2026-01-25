export type AssessmentType = 'onbaseu' | 'pitcher_onbaseu' | 'tpi_power' | 'sprint' | 'kams';
export type ResultColor = 'green' | 'yellow' | 'red' | 'blue';

export interface AssessmentSession {
  id: string;
  player_id: string;
  player_name: string | null;
  assessment_type: AssessmentType;
  assessment_date: string;
  assessed_by: string | null;
  assessed_by_name: string | null;
  notes: string | null;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface SessionCreate {
  player_id: string;
  assessment_type: AssessmentType;
  assessment_date: string;
  notes?: string | null;
}

export interface SessionUpdate {
  assessment_date?: string;
  notes?: string | null;
  is_complete?: boolean;
}

// Test Definition Types
export interface TestDefinition {
  code: string;
  name: string;
  category: string;
  subcategory?: string | null;
  is_bilateral: boolean;
  result_type: 'select' | 'numeric' | 'time';
  options?: string[];
  unit?: string;
  description?: string | null;
}

// OnBaseU Types
export interface OnBaseUResult {
  id?: string;
  session_id: string;
  test_code: string;
  test_name: string;
  test_category: string;
  subcategory?: string | null;
  side?: 'left' | 'right' | null;
  result: string;
  score: number;
  color: ResultColor;
  notes?: string | null;
  created_at?: string;
}

export interface OnBaseUResultCreate {
  test_code: string;
  test_name: string;
  test_category: string;
  subcategory?: string | null;
  side?: 'left' | 'right' | null;
  result: string;
  notes?: string | null;
}

// TPI Power Types
export interface TPIPowerResult {
  id?: string;
  session_id: string;
  test_code: string;
  test_name: string;
  result_value: number;
  side?: 'left' | 'right' | null;
  score_percentage?: number | null;
  color?: ResultColor | null;
  notes?: string | null;
  created_at?: string;
}

export interface TPIPowerResultCreate {
  test_code: string;
  test_name: string;
  result_value: number;
  side?: 'left' | 'right' | null;
  notes?: string | null;
}

// Sprint Types
export interface SprintResult {
  id?: string;
  session_id: string;
  test_code: string;
  test_name: string;
  test_category: 'linear' | 'directional' | 'curvilinear';
  shoe_type?: string | null;
  surface_type?: string | null;
  run_1_time?: number | null;
  run_2_time?: number | null;
  run_3_time?: number | null;
  best_time?: number | null;
  score_percentage?: number | null;
  color?: ResultColor | null;
  notes?: string | null;
  created_at?: string;
}

export interface SprintResultCreate {
  test_code: string;
  test_name: string;
  test_category: 'linear' | 'directional' | 'curvilinear';
  shoe_type?: string | null;
  surface_type?: string | null;
  run_1_time?: number | null;
  run_2_time?: number | null;
  run_3_time?: number | null;
  notes?: string | null;
}

// KAMS Types
export interface KAMSResult {
  id?: string;
  session_id: string;
  test_type: 'rom' | 'squat' | 'lunge' | 'balance' | 'jump';
  measurements: Record<string, unknown>;
  overall_score?: number | null;
  symmetry_score?: number | null;
  notes?: string | null;
  created_at?: string;
}

export interface KAMSResultCreate {
  test_type: 'rom' | 'squat' | 'lunge' | 'balance' | 'jump';
  measurements: Record<string, unknown>;
  notes?: string | null;
}
