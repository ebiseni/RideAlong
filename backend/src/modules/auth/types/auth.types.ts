export interface AuthUserResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: Date;
}

export interface AuthResponse {
  user: AuthUserResponse;
  accessToken: string;
  refreshToken: string;
}