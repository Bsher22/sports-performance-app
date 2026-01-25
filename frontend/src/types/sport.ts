import { AssessmentType } from './assessment';

export interface Sport {
  id: number;
  name: string;
  code: string;
  description: string | null;
  available_assessments: AssessmentType[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SportListItem {
  id: number;
  name: string;
  code: string;
  available_assessments: AssessmentType[];
  is_active: boolean;
}

export interface SportCreate {
  name: string;
  code: string;
  description?: string | null;
  available_assessments: AssessmentType[];
  is_active?: boolean;
}

export interface SportUpdate extends Partial<SportCreate> {}
