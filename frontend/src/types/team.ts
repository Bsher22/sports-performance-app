export interface Team {
  id: number;
  name: string;
  organization: string | null;
  sport: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  player_count?: number;
}

export interface TeamCreate {
  name: string;
  organization?: string | null;
  sport?: string;
  is_active?: boolean;
}

export interface TeamUpdate extends Partial<TeamCreate> {}

export interface TeamStats {
  team_id: number;
  team_name: string;
  total_players: number;
  active_players: number;
  pitchers: number;
  position_players: number;
  assessment_count: number;
}
