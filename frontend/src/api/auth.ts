import apiClient from "./client";

//
// Types
//

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface MessageResponse {
  message: string;
}

//
// API
//

export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/register", data);
  return response.data;
};

export const login = async (
  data: LoginRequest
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const refresh = async (): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth/refresh");
  return response.data;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await apiClient.get<AuthUser>("/auth/me");
  return response.data;
};

export const forgotPassword = async (
  data: ForgotPasswordRequest
): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(
    "/auth/forgot-password",
    data
  );

  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordRequest
): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(
    "/auth/reset-password",
    data
  );

  return response.data;
};

export const changePassword = async (
  data: ChangePasswordRequest
): Promise<MessageResponse> => {
  const response = await apiClient.post<MessageResponse>(
    "/auth/change-password",
    data
  );

  return response.data;
};
