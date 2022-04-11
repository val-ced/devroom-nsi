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
      { uuid: string; page?: number; limit?: number }
    >({
      query: ({ uuid, page, limit }) =>
        `articles/${uuid}/comments/?limit=${limit || 10}&offset=${
          ((page || 1) - 1) * (limit || 10)
        }`
    }),
    articleLikeSwitch: builder.mutation<{ success: string }, string>({
      query: (uuid) => ({
        url: `articles/${uuid}/like_switch/`,
        method: "PATCH"
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
  useArticleLikeSwitchMutation
} = articles;
