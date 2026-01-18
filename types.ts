export interface Sport {
  id: string;
  name: string;
}

export interface Team {
  name: string;
  badge: string;
}

export interface MatchTeams {
  home?: Team;
  away?: Team;
}

export interface APIMatch {
  id: string;
  title: string;
  category: string;
  date: number;
  popular: boolean;
  teams?: MatchTeams;
}

export interface Stream {
  id: string;
  streamNo: number;
  language: string;
  hd: boolean;
  embedUrl: string;
  source: string;
}

export interface MatchDetail extends APIMatch {
  sources: Stream[];
}

export interface NavigationItem {
  name: string;
  path: string;
  icon?: string;
}