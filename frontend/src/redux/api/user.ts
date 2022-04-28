import { Article } from "../../Types/Interfaces/Article";
import { Post } from "../../Types/Interfaces/Post";
import { Pagination } from "../../Types/Interfaces/Pagination";
import { UserLess } from "../../Types/Interfaces/User";
import { devroomApiAuth } from "./apiAuth";

const user = devroomApiAuth.injectEndpoints({
  endpoints: (builder) => ({
    getUserFollowers: builder.query<
      Pagination<UserLess>,
      { at: string; page?: number; limit?: number }
    >({
      query: ({ at, page, limit }) =>
        `users/${at}/followers/?limit${limit || 10}&offset=${
          ((page || 1) - 1) * (limit || 10)
        }`
    }),
    getUserFollowing: builder.query<
      Pagination<UserLess>,
      { at: string; page?: number; limit?: number }
    >({
      query: ({ at, page, limit }) =>
        `users/${at}/following/?limit${limit || 10}&offset=${
          ((page || 1) - 1) * (limit || 10)
        }`
    }),
    getUserPosts: builder.query<
      Pagination<Post>,
      { at: string; page?: number; limit?: number }
    >({
      query: ({ at, page, limit }) =>
        `users/${at}/posts/?limit${limit || 10}&offset=${
          ((page || 1) - 1) * (limit || 10)
        }`
    }),
    getUserArticles: builder.query<
      Pagination<Article>,
      { at: string; page?: number; limit?: number }
    >({
      query: ({ at, page, limit }) =>
        `users/${at}/articles/?limit${limit || 10}&offset=${
          ((page || 1) - 1) * (limit || 10)
        }`
    }),
    userFollow: builder.mutation<any, string>({
      query: (at) => ({
        url: `users/${at}/follow/`,
        method: "POST"
      })
    }),
    userUnfollow: builder.mutation<any, string>({
      query: (at) => ({
        url: `users/${at}/unfollow/`,
        method: "POST"
      })
    }),
    newComment: builder.mutation<
      Post | Article,
      { body: string; type: "post" | "article"; uuid: string }
    >({
      query: ({ body, uuid, type }) => ({
        url: `${type}s/${uuid}/comment/`,
        method: "POST",
        body: { body }
      })
    }),
    likeSwitch: builder.mutation<
      { success: string; is_liked: boolean },
      { type: "post" | "article"; uuid: string }
    >({
      query: ({ type, uuid }) => ({
        url: `${type}s/${uuid}/like_switch/`,
        method: "PATCH"
      })
    })
  }),
  overrideExisting: false
});

export const {
  useGetUserFollowersQuery,
  useLazyGetUserFollowersQuery,
  useGetUserFollowingQuery,
  useLazyGetUserFollowingQuery,
  useGetUserArticlesQuery,
  useLazyGetUserArticlesQuery,
  useGetUserPostsQuery,
  useLazyGetUserPostsQuery,
  useUserFollowMutation,
  useUserUnfollowMutation,
  useNewCommentMutation,
  useLikeSwitchMutation
} = user;
