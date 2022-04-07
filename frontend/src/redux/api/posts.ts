import { Pagination } from "../../Types/Interfaces/Pagination";
import { Post } from "../../Types/Interfaces/Post";
import { devroomApiAuth } from "./apiAuth";
import { PostRequest } from "./me";

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
    }),
    postLikeSwitch: builder.mutation<{ success: string }, string>({
      query: (uuid) => ({
        url: `articles/${uuid}/like_switch/`,
        method: "PATCH"
      })
    }),
    newPostComment: builder.mutation<Post, PostRequest & { uuid: string }>({
      query: ({ body, uuid }) => ({
        url: `posts/${uuid}/comment/`,
        method: "POST",
        body: { body }
      })
    })
  }),
  overrideExisting: false
});

export const {
  useGetPostQuery,
  useLazyGetPostQuery,
  useGetPostCommentsQuery,
  useLazyGetPostCommentsQuery,
  usePostLikeSwitchMutation,
  useNewPostCommentMutation
} = posts;
