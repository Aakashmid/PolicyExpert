// src/features/policy/components/PolicyTable.tsx
import { LuEye, LuTrash2 } from "react-icons/lu";
import type { Policy } from "../policy.types";

interface PolicyTableProps {
  policies: Policy[];
  onDelete: (policy: Policy) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export default function PolicyTable({ policies, onDelete }: PolicyTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="px-5 py-3 font-medium">Policy Name</th>
            <th className="px-5 py-3 font-medium">Department</th>
            <th className="px-5 py-3 font-medium">Version</th>
            <th className="px-5 py-3 font-medium">Effective From</th>
            <th className="px-5 py-3 font-medium">Uploaded On</th>
            <th className="px-5 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {policies.map((policy) => (
            <tr key={policy.id} className="hover:bg-slate-50">
              <td className="px-5 py-3">
                <p className="font-medium text-heading">{policy.name}</p>
                {policy.uploaded_by_name?.trim() && (
                  <p className="text-xs text-muted">
                    by {policy.uploaded_by_name}
                  </p>
                )}
              </td>
              <td className="px-5 py-3 text-body">{policy.department}</td>
              <td className="px-5 py-3 text-body">{policy.version}</td>
              <td className="px-5 py-3 text-body">
                {formatDate(policy.effective_from)}
              </td>
              <td className="px-5 py-3 text-body">
                {formatDate(policy.uploaded_on)}
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-1">
                  <a
                    href={policy.view_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${policy.name}`}
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-slate-100 hover:text-heading"
                  >
                    <LuEye className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => onDelete(policy)}
                    aria-label={`Delete ${policy.name}`}
                    className="rounded-lg p-2 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                  >
                    <LuTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
