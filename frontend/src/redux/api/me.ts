import { Article } from "../../Types/Interfaces/Article";
import { Post } from "../../Types/Interfaces/Post";
import { Pagination } from "../../Types/Interfaces/Pagination";
import { User } from "../../Types/Interfaces/User";
import { devroomApiAuth } from "./apiAuth";

const meApi = devroomApiAuth.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => "user/"
    }),
    getMeFollowers: builder.query<Pagination<User>, number | void>({
      query: (limit) =>
        `user/followers/?limit=${limit || 10}&offset=${limit || 10}`
    }),
    getMeFollowing: builder.query<Pagination<User>, number | void>({
      query: (limit) =>
        `user/following/?limit${limit || 10}&offset=${limit || 10}`
    }),
    getMePosts: builder.query<Pagination<Post>, number | void>({
      query: (limit) => `user/posts/?limit${limit || 10}&offset=${limit || 10}`
    }),
    getMeArticles: builder.query<Pagination<Article>, number | void>({
      query: (limit) =>
        `user/articles/?limit${limit || 10}&offset=${limit || 10}`
    })
  }),
  overrideExisting: false
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useGetMeFollowersQuery,
  useLazyGetMeFollowersQuery,
  useGetMeFollowingQuery,
  useLazyGetMeFollowingQuery,
  useGetMeArticlesQuery,
  useLazyGetMeArticlesQuery,
  useGetMePostsQuery,
  useLazyGetMePostsQuery
} = meApi;
