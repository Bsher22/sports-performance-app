import { ResultColor, AssessmentType } from './assessment';

export interface PlayerProgress {
  player_id: string;
  assessment_type: AssessmentType;
  progress_data: ProgressDataPoint[];
  trend: TrendInfo;
  total_assessments: number;
}

export interface ProgressDataPoint {
  date: string;
  session_id: string;
  scores: ScoreData;
  overall_score: number;
}

export interface ScoreData {
  overall: number;
  color: ResultColor;
  categories: Record<string, number>;
}

export interface TrendInfo {
  direction: 'improving' | 'declining' | 'stable';
  change: number;
  first_score?: number;
  last_score?: number;
}

export interface PlayerSummary {
  player_id: string;
  player_name: string;
  team_name: string | null;
  assessments: Record<AssessmentType, AssessmentSummary>;
}

export interface AssessmentSummary {
  latest_date: string;
  overall_score: number;
  category_scores: Record<string, number>;
  color: ResultColor;
}

export interface PlayerComparison {
  assessment_type: AssessmentType;
  comparison_data: Record<string, ComparisonData>;
  rankings: RankingEntry[];
}

export interface ComparisonData {
  player_name: string;
  team_name: string | null;
  assessment_date: string;
  overall_score: number;
  category_scores: Record<string, number>;
  color: ResultColor;
}

export interface RankingEntry {
  player_id: string;
  rank: number;
}

export interface TeamOverview {
  team_id: number;
  team_name: string;
  organization: string | null;
  player_count: number;
  pitchers: number;
  position_players: number;
  assessment_counts: Record<string, number>;
  team_averages: Record<AssessmentType, TeamAverage>;
}

export interface TeamAverage {
  average: number;
  player_count: number;
  min: number;
  max: number;
}

export interface TeamTrends {
  team_id: number;
  team_name: string;
  assessment_type: AssessmentType;
  trend_data: TrendDataPoint[];
  trend: TrendInfo;
}

export interface TrendDataPoint {
  date: string;
  average_score: number;
  assessment_count: number;
}

export interface TeamRankings {
  team_id: number;
  team_name: string;
  assessment_type: AssessmentType;
  rankings: PlayerRanking[];
  total_players: number;
}

export interface PlayerRanking {
  player_id: string;
  player_name: string;
  overall_score: number;
  assessment_date: string;
  rank: number;
}
