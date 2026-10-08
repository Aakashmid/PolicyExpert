// src/features/dashboard/components/RecentActivity.tsx
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import type { ActivityItem } from "../dashboard.types";

export default function RecentActivity({ data }: { data: ActivityItem[] }) {
  return (
    <Card>
      <h2 className="mb-4 text-base font-medium">Recent Activity</h2>

      {/* Scrolls sideways on small screens instead of breaking the page */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted">
              <th className="pb-3 font-medium">Activity</th>
              <th className="pb-3 font-medium">Policy</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row) => (
              <tr key={row.id}>
                <td className="py-3 text-body">{row.activity}</td>
                <td className="py-3 text-body">{row.policy}</td>
                <td className="py-3">
                  <Badge status={row.status} />
                </td>
                <td className="py-3 text-muted">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
