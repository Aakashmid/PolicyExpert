// src/components/ui/Badge.tsx
export type StatusType = "completed" | "processing" | "failed" | "queued";

const styles: Record<StatusType, string> = {
  completed: "bg-success/10 text-success",
  processing: "bg-warning/10 text-warning",
  failed: "bg-danger/10 text-danger",
  queued: "bg-slate-100 text-muted",
};

const labels: Record<StatusType, string> = {
  completed: "Completed",
  processing: "Processing",
  failed: "Failed",
  queued: "Queued",
};

export default function Badge({ status }: { status: StatusType }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
