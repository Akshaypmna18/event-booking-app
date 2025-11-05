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
  theatres: Theatre[];
}

export interface Theatre {
  name: string;
  shows: Show[];
}

export interface Show {
  screen: string;
  time: string;
}
