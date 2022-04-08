import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";
import { TokenDecoded } from "../../../Types/Interfaces/Token";
import { devroomApiAuth } from "../../api/apiAuth";
import { cookies } from "../../common";
import { AppDispatch } from "../../store";

type AuthState = {
  refresh: string | null;
  access: string | null;
  expires: number;
  isLoggedIn: boolean;
  timeoutId: number | null;
};

const slice = createSlice({
  name: "auth",
  initialState: {
    refresh: null,
    access: null,
    expires: -1,
    isLoggedIn: false
  } as AuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { refresh, access }
      }: PayloadAction<{ refresh: string; access: string }>
    ) => {
      state.refresh = refresh;
      state.access = access;
      const refreshD: TokenDecoded = jwt_decode(refresh);
      const accessD: TokenDecoded = jwt_decode(access);
      const accEpoch = new Date(0);
      accEpoch.setUTCSeconds(accessD.exp);
      const refEpoch = new Date(0);
      refEpoch.setUTCSeconds(refreshD.exp);
      cookies.set("access", access, {
        expires: accEpoch,
        secure: true,
        sameSite: "lax",
        path: "/"
      });
      cookies.set("refresh", refresh, {
        expires: refEpoch,
        secure: true,
        sameSite: "lax",
        path: "/"
      });
      state.expires = accessD.exp * 1000 - Date.now();
      state.isLoggedIn = true;
    },
    logout: (state) => {
      cookies.remove("access");
      cookies.remove("refresh");
      cookies.remove("csrftoken");
      state.refresh = null;
      state.access = null;
      state.expires = -1;
      state.isLoggedIn = false;
      state.timeoutId = null;
    },
    addTimeout: (state, { payload: { id } }: PayloadAction<{ id: number }>) => {
      state.timeoutId = id;
    },
    removeTimeout: (state) => {
      if (state.timeoutId) clearTimeout(state.timeoutId);
      state.timeoutId = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase("auth/clearAccessToken", (state) => {
      state.access = null;
    });
    builder.addMatcher(
      devroomApiAuth.endpoints.refresh.matchRejected,
      (state) => {
        state.refresh = null;
        state.access = null;
        state.expires = -1;
        state.isLoggedIn = false;
        if (state.timeoutId) clearTimeout(state.timeoutId);
        state.timeoutId = null;
        cookies.remove("access");
        cookies.remove("refresh");
        cookies.remove("csrftoken");
      }
    );
  }
});

export const { setCredentials, logout, addTimeout, removeTimeout } =
  slice.actions;
export default slice.reducer;

export function clearAccessToken(timeout: number) {
  return function clearAccessTokenThunk(dispatch: AppDispatch) {
    const id = setTimeout(() => {
      console.log("Itsa me mariao");
      dispatch({ type: "auth/clearAccessToken" });
      dispatch(removeTimeout());
    }, timeout) as unknown as number;
    console.log(id);
    dispatch(addTimeout({ id }));
  };
}
