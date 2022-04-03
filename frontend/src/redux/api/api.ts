import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User, UserLess } from "../../Types/Interfaces/User";
import { cookies } from "../common";
import { LoginRequest } from "./apiAuth";

export const devroomApi = createApi({
  reducerPath: "devroomApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  endpoints: (builder) => ({
    getUser: builder.query<User, string>({
      query: (at) => `users/${at}`
    }),
    register: builder.mutation<
      UserLess,
      LoginRequest & { username: string; password2: string }
    >({
      query: (credentials) => ({
        url: "user/register/",
        method: "POST",
        body: credentials,
        credentials: "include"
      })
    }),
    getCsrf: builder.mutation({
      query: () => "csrf/"
    })
  })
});

export const { useGetUserQuery, useRegisterMutation, useGetCsrfMutation } =
  devroomApi;
