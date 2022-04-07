import { Article } from "../../Types/Interfaces/Article";
import { Post } from "../../Types/Interfaces/Post";
import { Pagination } from "../../Types/Interfaces/Pagination";
import { devroomApiAuth } from "./apiAuth";

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
    })
  }),
  overrideExisting: false
});

export const {
  useGetArticleQuery,
  useLazyGetArticleQuery,
  useGetArticleCommentsQuery,
  useLazyGetArticleCommentsQuery
} = articles;
