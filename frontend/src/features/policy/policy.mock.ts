// src/features/policy/policy.mock.ts
// Temporary data. Delete once the API is ready.
import type { PaginatedResponse, Policy, PolicyStatus } from "./policy.types";

const NAMES = [
  "HR Policy Handbook",
  "Leave Policy",
  "Travel Policy",
  "IT Security Policy",
  "Code of Conduct",
  "Remote Work Policy",
  "Data Protection Policy",
  "Expense Policy",
  "Anti-Harassment Policy",
  "Onboarding Guide",
];
const DEPARTMENTS = ["HR", "IT", "Finance", "Legal", "Operations", "Compliance"];

// 60 policies. Every 6th one is not ready, so the status filter has something to hide.
const NOT_READY: PolicyStatus[] = ["processing", "failed", "queued"];

const ALL_POLICIES: Policy[] = Array.from({ length: 60 }, (_, i) => {
  const day = String((i % 28) + 1).padStart(2, "0");
  const status: PolicyStatus = i % 6 === 5 ? NOT_READY[(i / 6) % 3 | 0] : "ready";

  return {
    id: i + 1,
    name: `${NAMES[i % NAMES.length]}${i >= NAMES.length ? ` ${Math.floor(i / NAMES.length) + 1}` : ""}.pdf`,
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    status,
    version: `v${(i % 3) + 1}.${i % 2}`,
    description: null,
    effective_from: `2026-09-${day}T00:00:00Z`,
    uploaded_on: `2026-10-${day}T10:30:00Z`,
    updated_on: `2026-10-${day}T10:30:00Z`,
    uploaded_by_name: "Admin",
    processing_error: status === "failed" ? "Could not extract text from PDF" : null,
    is_retryable: status === "failed",
    view_url: "#",
  };
});

// Behaves like the real paginated endpoint
export const getMockPoliciesPage = async (params: {
  page: number;
  page_size: number;
  status?: PolicyStatus;
}): Promise<PaginatedResponse<Policy>> => {
  await new Promise((resolve) => setTimeout(resolve, 600)); // fake network delay

  const filtered = params.status
    ? ALL_POLICIES.filter((p) => p.status === params.status)
    : ALL_POLICIES;

  const start = (params.page - 1) * params.page_size;
  const end = start + params.page_size;

  return {
    count: filtered.length,
    next: end < filtered.length ? `?page=${params.page + 1}` : null,
    previous: params.page > 1 ? `?page=${params.page - 1}` : null,
    results: filtered.slice(start, end),
  };
};