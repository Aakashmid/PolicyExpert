// src/features/dashboard/dashboard.types.ts
import type { StatusType } from "@/components/ui/Badge";

export type StatKey = "policies" | "questions" | "users" | "accuracy";

export interface StatItem {
  key: StatKey;
  title: string;
  value: string;
  change: string;
}

export interface StatusCount {
  status: "completed" | "processing" | "failed";
  count: number;
}

export interface RecentUpload {
  id: number;
  name: string;
  uploadedAt: string;
  status: StatusType;
}

export interface ActivityItem {
  id: number;
  activity: string;
  policy: string;
  status: StatusType;
  time: string;
}

export interface DashboardData {
  stats: StatItem[];
  statusCounts: StatusCount[];
  recentUploads: RecentUpload[];
  recentActivity: ActivityItem[];
}