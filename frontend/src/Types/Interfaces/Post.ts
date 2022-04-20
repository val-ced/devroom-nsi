export interface Post {
  id: string;
  post_url: string;
  comments_url: string;
  parent: null | string;
  parent_url: null | string;
  author_meta: {
    at: string;
    url: string;
    username: string;
    logo: string;
  };
  comments: number;
  type: "P" | "C";
  likes: number;
  body: string;
  date: string;
  is_liked: boolean;
}
