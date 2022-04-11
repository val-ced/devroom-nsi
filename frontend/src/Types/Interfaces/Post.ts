export interface Post {
  id: string;
  post_url: string;
  comments_url: string;
  parent: null | string;
  parent_url: null | string;
  author: string;
  author_url: string;
  comments: number;
  type: "P" | "C";
  likes: number;
  body: string;
  date: string;
}
