export type Token = {
  refresh: string;
  access: string;
};

export interface TokenDecoded {
  token_type: "refresh" | "access";
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
}
