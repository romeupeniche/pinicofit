export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: "male" | "female" | "other";
  goal: "bulk" | "cut" | "mantain";
  isProfileComplete: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
