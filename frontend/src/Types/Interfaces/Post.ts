export interface Post {
  id: string;
  post_url: string;
  comments_url: string;
  parent: null | string;
  author: string;
  comments: number;
  type: "P" | "C";
  likes: number;
  body: string;
  date: string;
}
