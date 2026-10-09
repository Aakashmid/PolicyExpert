// src/features/auth/services/auth.api.ts
import api from "@/services/api";
import type { LoginPayload, LoginResponse, User } from "@/features/auth/auth.types";

export const loginRequest = async (payload: LoginPayload) => {
  const { data } = await api.post<LoginResponse>("/auth/login/", payload);
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.get<User>("/users/me/");
  return data;
};

// Only needed if your backend blacklists refresh tokens
export const logoutRequest = () => api.post("/auth/logout/");


export const refreshRequest = async () => {
  const { data } = await api.post<LoginResponse>("/auth/token/refresh/");
  return data;
};

export const changePassword = async (oldPassword: string, newPassword: string) => {
  const { data } = await api.post("/auth/change-password/", {
    old_password: oldPassword,
    new_password: newPassword,
  });
  return data;
};


/*
change password usage example in component:

import { changePassword } from "@/services/auth.api";

const handleChangePassword = async () => {
  try {
    await changePassword(currentPassword, newPassword);
    alert("Password changed successfully!");
  } catch (error: any) {
    // Handle error here (toast, message, redirect, etc.)
    console.error(error);
    alert("Failed to change password");
  }
};


*/