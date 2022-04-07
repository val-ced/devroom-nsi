import { Article } from "../../Types/Interfaces/Article";
import { Post } from "../../Types/Interfaces/Post";
import { Pagination } from "../../Types/Interfaces/Pagination";
import { devroomApiAuth } from "./apiAuth";
import { ArticleRequest } from "./me";

const articles = devroomApiAuth.injectEndpoints({
  endpoints: (builder) => ({
    getArticle: builder.query<Article, string>({
      query: (uuid) => `articles/${uuid}`
    }),
    getArticleComments: builder.query<
      Pagination<Post>,
      { uuid: string; limit?: number }
    >({
      query: ({ uuid, limit }) =>
        `articles/${uuid}/comments/?limit=${limit || 10}&offset=${limit || 10}`
    }),
    articleLikeSwitch: builder.mutation<{ success: string }, string>({
      query: (uuid) => ({
        url: `articles/${uuid}/like_switch/`,
        method: "PATCH"
      })
    }),
    newArticleComment: builder.mutation<
      Article,
      ArticleRequest & { uuid: string }
    >({
      query: ({ body, title, uuid }) => ({
        url: `articles/${uuid}/comment/`,
        method: "POST",
        body: { body, title }
      })
    })
  }),
  overrideExisting: false
});

export const {
  useGetArticleQuery,
  useLazyGetArticleQuery,
  useGetArticleCommentsQuery,
  useLazyGetArticleCommentsQuery,
  useArticleLikeSwitchMutation,
  useNewArticleCommentMutation
} = articles;
