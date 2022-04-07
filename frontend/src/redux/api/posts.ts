import { Pagination } from "../../Types/Interfaces/Pagination";
import { Post } from "../../Types/Interfaces/Post";
import { devroomApiAuth } from "./apiAuth";

const posts = devroomApiAuth.injectEndpoints({
  endpoints: (builder) => ({
    getPost: builder.query<Post, string>({
      query: (uuid) => `posts/${uuid}`
    }),
    getPostComments: builder.query<
      Pagination<Post>,
      { uuid: string; limit?: number }
    >({
      query: ({ uuid, limit }) =>
        `posts/${uuid}/comments/?limit=${limit || 10}&offset=${limit || 10}`
    })
  })
});

export const {
  useGetPostQuery,
  useLazyGetPostQuery,
  useGetPostCommentsQuery,
  useLazyGetPostCommentsQuery
} = posts;
