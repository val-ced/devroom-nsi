import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Article } from "../../Types/Interfaces/Article";
import { Pagination } from "../../Types/Interfaces/Pagination";
import { Post } from "../../Types/Interfaces/Post";
import { Token } from "../../Types/Interfaces/Token";
import { User, UserLess } from "../../Types/Interfaces/User";
import { RootState } from "../store";

export interface LoginRequest {
  at: string;
  password: string;
}

export const devroomApiAuth = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.access;
      if (token) {
        headers.set("Authorization", `JWT ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    login: builder.mutation<Token, LoginRequest>({
      query: (credentials) => ({
        url: "user/auth/token/",
        method: "POST",
        body: credentials
      })
    }),
    refresh: builder.mutation<{ access: string }, string>({
      query: (refresh) => ({
        url: "user/auth/token/refresh/",
        method: "POST",
        body: {
          refresh
        }
      })
    }),
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
    }),
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
    }),
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
    getArticle: builder.query<Article, string>({
      query: (uuid) => `articles/${uuid}`
    }),
    getArticleComments: builder.query<
      Pagination<Post>,
      { uuid: string; limit?: number }
    >({
      query: ({ uuid, limit }) =>
        `articles/${uuid}/comments/?limit=${limit || 10}&offset=${limit || 10}`
    })
  })
});

export const {
  useLoginMutation,
  useRefreshMutation,

  useGetMeQuery,
  useLazyGetMeQuery,
  useGetMeFollowersQuery,
  useLazyGetMeFollowersQuery,
  useGetMeFollowingQuery,
  useLazyGetMeFollowingQuery,
  useGetMeArticlesQuery,
  useLazyGetMeArticlesQuery,
  useGetMePostsQuery,
  useLazyGetMePostsQuery,

  useGetUserFollowersQuery,
  useLazyGetUserFollowersQuery,
  useGetUserFollowingQuery,
  useLazyGetUserFollowingQuery,
  useGetUserArticlesQuery,
  useLazyGetUserArticlesQuery,
  useGetUserPostsQuery,
  useLazyGetUserPostsQuery,

  useGetPostQuery,
  useLazyGetPostQuery,
  useGetPostCommentsQuery,
  useLazyGetPostCommentsQuery,

  useGetArticleQuery,
  useLazyGetArticleQuery,
  useGetArticleCommentsQuery,
  useLazyGetArticleCommentsQuery
} = devroomApiAuth;
