import { Article } from "../../Types/Interfaces/Article";
import { Post } from "../../Types/Interfaces/Post";
import { Pagination } from "../../Types/Interfaces/Pagination";
import { UserLess } from "../../Types/Interfaces/User";
import { devroomApi } from "./api";

const user = devroomApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserFollowers: builder.query<
      Pagination<UserLess>,
      { at: string; limit?: number }
    >({
      query: ({ at, limit }) =>
        `users/${at}/followers/?limit${limit || 10}&offset=${limit || 10}`
    }),
    getUserFollowing: builder.query<
      Pagination<UserLess>,
      { at: string; limit?: number }
    >({
      query: ({ at, limit }) =>
        `users/${at}/following/?limit${limit || 10}&offset=${limit || 10}`
    }),
    getUserPosts: builder.query<
      Pagination<Post>,
      { at: string; limit?: number }
    >({
      query: ({ at, limit }) =>
        `users/${at}/posts/?limit${limit || 10}&offset=${limit || 10}`
    }),
    getUserArticles: builder.query<
      Pagination<Article>,
      { at: string; limit?: number }
    >({
      query: ({ at, limit }) =>
        `users/${at}/articles/?limit${limit || 10}&offset=${limit || 10}`
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
  useLazyGetUserPostsQuery
} = user;
