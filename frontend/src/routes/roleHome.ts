// src/routes/roleHome.ts
import type { Role } from "@/features/auth/auth.types";

export const roleHome: Record<Role, string> = {
  admin: "/admin/dashboard",
  employee: "/chat",
};