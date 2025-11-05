export interface Movie {
  id: string;
  title: string;
  genre: string;
  language: string;
  duration: string;
  rating: number;
  poster: string;
  description: string;
  cast: string[];
  director: string;
  shows: Show[];
}

export interface Show {
  theatre: string;
  screen: string;
  time: string;
}
