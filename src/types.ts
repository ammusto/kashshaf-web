export interface BookMetadata {
  id: number;
  corpus?: string;
  title: string;
  author_id?: number;
  death_ah?: number;
  century_ah?: number;
  genre_id?: number;
  page_count?: number;
  token_count?: number;
  original_id?: string;
  paginated?: boolean;
  tags?: string;
  in_corpus?: boolean;
  parts?: number;
  metadata_json?: string;
  citation_json?: string;
}

export type SortKey = 'title' | 'author' | 'death' | 'genre';
export type SortDir = 'asc' | 'desc';
