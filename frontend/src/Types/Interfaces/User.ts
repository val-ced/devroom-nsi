import { Article } from "./Article";
import { Post } from "./Post";

export interface User {
  at: string;
  username: string;
  bio: string;
  followers: number;
  following: number;
  last_login: string;
  created_on: string;
  is_public: boolean;
  total_likes: number;
  articles: number;
  posts: number;
  logo: string;
  is_active: boolean;
  following_url: string;
  followers_url: string;
  timeline_posts: Post[];
  timeline_articles: Article[];
}

export interface UserLess {
  at: string;
  username: string;
}
