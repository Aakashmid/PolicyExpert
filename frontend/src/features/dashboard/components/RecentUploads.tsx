// src/features/dashboard/components/RecentUploads.tsx
import { Link } from "react-router-dom";
import { LuFileText } from "react-icons/lu";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { RecentUpload } from "../dashboard.types";

export default function RecentUploads({ data }: { data: RecentUpload[] }) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-medium">Recently Uploaded</h2>
        <Link
          to="/admin/policies"
          className="text-sm text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <ul className="flex flex-col divide-y divide-border">
        {data.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10 text-danger">
              <LuFileText className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-heading">
                {item.name}
              </p>
              <p className="text-xs text-muted">
                Uploaded on {item.uploadedAt}
              </p>
            </div>
            <Badge status={item.status} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
