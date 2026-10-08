// src/config/navItems.ts
import type { IconType } from "react-icons";
import {
  LuLayoutDashboard,
  LuFileText,
  LuUpload,
  LuListChecks,
  LuActivity,
  LuClipboardCheck,
  LuUsers,
  LuSettings,
  LuMessageSquarePlus,
  LuHistory,
  LuBookmark,
  LuMessageSquare,
  LuUser,
} from "react-icons/lu";

export interface NavItem {
  title: string;
  path: string;
  icon: IconType;
}

export const adminNav: NavItem[] = [
  { title: "Dashboard", path: "/admin/dashboard", icon: LuLayoutDashboard },
  { title: "Policies", path: "/admin/policies", icon: LuFileText },
  { title: "Upload Policy", path: "/admin/upload", icon: LuUpload },
  { title: "Processing Queue", path: "/admin/queue", icon: LuListChecks },
  { title: "Analytics", path: "/admin/analytics", icon: LuActivity },
  { title: "Evaluation", path: "/admin/evaluation", icon: LuClipboardCheck },
  { title: "Users", path: "/admin/users", icon: LuUsers },
  { title: "Settings", path: "/admin/settings", icon: LuSettings },
];

export const employeeNav: NavItem[] = [
  { title: "New Chat", path: "/chat", icon: LuMessageSquarePlus },
  { title: "Chat History", path: "/history", icon: LuHistory },
  { title: "Bookmarks", path: "/bookmarks", icon: LuBookmark },
  { title: "Feedback", path: "/feedback", icon: LuMessageSquare },
  { title: "Profile", path: "/profile", icon: LuUser },
];