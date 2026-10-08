// src/features/dashboard/dashboard.mock.ts
// Temporary data. Delete once the API is ready.
import type { DashboardData } from "./dashboard.types";

export const dashboardMock: DashboardData = {
  stats: [
    { key: "policies", title: "Total Policies", value: "12", change: "+2 this month" },
    { key: "questions", title: "Total Questions", value: "1,248", change: "+180 this month" },
    { key: "users", title: "Total Users", value: "156", change: "+12 this month" },
    { key: "accuracy", title: "Accuracy (Eval)", value: "91.2%", change: "+3.4%" },
  ],
  statusCounts: [
    { status: "completed", count: 10 },
    { status: "processing", count: 1 },
    { status: "failed", count: 1 },
  ],
  recentUploads: [
    { id: 1, name: "HR Policy Handbook.pdf", uploadedAt: "May 20, 2024", status: "completed" },
    { id: 2, name: "Leave Policy.pdf", uploadedAt: "May 18, 2024", status: "completed" },
    { id: 3, name: "Travel Policy.pdf", uploadedAt: "May 15, 2024", status: "completed" },
  ],
  recentActivity: [
    { id: 1, activity: "Policy uploaded", policy: "HR Policy Handbook.pdf", status: "completed", time: "2 mins ago" },
    { id: 2, activity: "Processing started", policy: "Benefits Policy.pdf", status: "processing", time: "10 mins ago" },
    { id: 3, activity: "Processing failed", policy: "Vendor Policy.pdf", status: "failed", time: "1 hour ago" },
  ],
};