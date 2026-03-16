export interface User {
  id: string;
  name: string;
  email: string;
  isProfileComplete: boolean;
  age?: number;
  weight?: number;
  height?: number;
  gender?: "male" | "female" | "other";
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
