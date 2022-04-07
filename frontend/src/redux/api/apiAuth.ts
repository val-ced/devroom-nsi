import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Token } from "../../Types/Interfaces/Token";
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
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
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
    })
  })
});

export const { useLoginMutation, useRefreshMutation } = devroomApiAuth;
