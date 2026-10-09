// src/features/policy/policy.types.ts
export type PolicyStatus = "queued" | "processing" | "ready" | "failed";

export interface Policy {
  id: number;
  name: string;
  department: string;
  status: PolicyStatus;
  version: string;
  description: string | null;
  effective_from: string;    // ISO date string
  uploaded_on: string;       // ISO date string
  updated_on: string;        // ISO date string
  uploaded_by_name: string;
  page_count:number;
  processing_error: string | null; // set when status is "failed"
  is_retryable: boolean;           // shows the retry button in the queue
  view_url: string;                // opens the PDF
}

// Upload form data, sent as multipart/form-data
export interface UploadPolicyPayload {
  file: File;
  name: string;
  department: string;
  version: string;
  effective_from: string;   // value of the date input
  description?: string;
}