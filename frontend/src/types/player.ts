export interface Player {
  id: string;
  player_code: string;
  first_name: string;
  last_name: string;
  full_name: string;
  display_name: string;
  team_id: number | null;
  team_name: string | null;
  sport_id: number | null;
  sport_name: string | null;
  graduation_year: number | null;
  date_of_birth: string | null;
  is_pitcher: boolean;
  is_position_player: boolean;
  bats: 'R' | 'L' | 'S' | null;
  throws: 'R' | 'L' | null;
  height_inches: number | null;
  weight_lbs: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlayerListItem {
  id: string;
  player_code: string;
  full_name: string;
  team_name: string | null;
  sport_id: number | null;
  sport_name: string | null;
  is_pitcher: boolean;
  is_position_player: boolean;
  is_active: boolean;
  graduation_year: number | null;
}

export interface PlayerCreate {
  first_name: string;
  last_name: string;
  team_id?: number | null;
  sport_id?: number | null;
  graduation_year?: number | null;
  date_of_birth?: string | null;
  is_pitcher?: boolean;
  is_position_player?: boolean;
  bats?: 'R' | 'L' | 'S' | null;
  throws?: 'R' | 'L' | null;
  height_inches?: number | null;
  weight_lbs?: number | null;
}

export interface PlayerUpdate extends Partial<PlayerCreate> {
  is_active?: boolean;
}

export interface PlayerWithAssessments extends Player {
  assessment_count: number;
  latest_assessment_date: string | null;
  assessment_types: string[];
}
