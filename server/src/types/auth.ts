import type { UserMeResponse } from "./users";

export type AuthResponse = {
  access_token: string;
  user: UserMeResponse;
};

