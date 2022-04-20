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
      { uuid: string; page?: number; limit?: number }
    >({
      query: ({ uuid, page, limit }) =>
        `posts/${uuid}/comments/?limit=${limit || 10}&offset=${
          ((page || 1) - 1) * (limit || 10)
        }`
    })
  }),
  overrideExisting: false
});

export const {
  useGetPostQuery,
  useLazyGetPostQuery,
  useGetPostCommentsQuery,
  useLazyGetPostCommentsQuery
} = posts;
