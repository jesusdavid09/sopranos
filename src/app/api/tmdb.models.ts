export interface Genre {
  id: number;
  name: string;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
  overview: string;
}

export interface ShowDetails {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  tagline: string;
  status: string;
  type: string;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  vote_average: number;
  vote_count: number;
  popularity: number;
  poster_path: string | null;
  backdrop_path: string | null;
  original_language: string;
  genres: Genre[];
  networks: Network[];
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
  seasons: Season[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  air_date: string;
  vote_average: number;
  vote_count: number;
  still_path: string | null;
}

export interface SeasonDetails {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episodes: Episode[];
}

export interface CastRole {
  character: string;
  episode_count: number;
}

export interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  roles: CastRole[];
  total_episode_count: number;
}

export interface CreditsResponse {
  cast: CastMember[];
  crew: any[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface VideosResponse {
  results: Video[];
}

export interface Keyword {
  id: number;
  name: string;
}

export interface KeywordsResponse {
  results?: Keyword[];
  keywords?: Keyword[];
}

export interface TvShow {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
}

export interface ShowsResponse {
  results: TvShow[];
  total_pages: number;
  total_results: number;
}

export interface SeasonCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface SeasonCreditsResponse {
  cast: SeasonCastMember[];
  crew: any[];
}
