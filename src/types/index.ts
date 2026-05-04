export interface Story {
  id: string;
  title: string;
  author_id: string;
  author_name: string;
  description: string;
  cover_url: string;
  views: number;
  rating: number;
  status: 'ongoing' | 'completed';
  category: string;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  story_id: string;
  title: string;
  content: string;
  chapter_number: number;
  link_url?: string;
  views: number;
  created_at: string;
}

export interface Comment {
  id: string;
  story_id?: string;
  chapter_id?: string;
  user_id: string;
  user_name: string;
  content: string;
  rating?: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  role: 'writer' | 'admin';
  avatar_url?: string;
}
