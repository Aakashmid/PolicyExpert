// src/features/dashboard/components/PolicyStatusChart.tsx
import Card from "@/components/ui/Card";
import type { StatusCount } from "../dashboard.types";

const colors: Record<StatusCount["status"], string> = {
  completed: "var(--color-success)",
  processing: "var(--color-warning)",
  failed: "var(--color-danger)",
};

const labels: Record<StatusCount["status"], string> = {
  completed: "Completed",
  processing: "Processing",
  failed: "Failed",
};

const SIZE = 160;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function PolicyStatusChart({ data }: { data: StatusCount[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  // Each segment starts where the previous one ended
  let offset = 0;
  const segments = data.map((d) => {
    const length = total ? (d.count / total) * CIRCUMFERENCE : 0;
    const segment = { ...d, length, offset };
    offset += length;
    return segment;
  });

  return (
    <Card>
      <h2 className="mb-4 text-base font-medium">Policies Status</h2>
      <div className="flex flex-wrap items-center justify-center gap-8">
        <div className="relative h-40 w-40">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="h-full w-full -rotate-90"
          >
            {segments.map((s) => (
              <circle
                key={s.status}
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={colors[s.status]}
                strokeWidth={STROKE}
                strokeDasharray={`${s.length} ${CIRCUMFERENCE - s.length}`}
                strokeDashoffset={-s.offset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-heading">{total}</span>
            <span className="text-xs text-muted">Total</span>
          </div>
        </div>

        <ul className="flex flex-col gap-2 text-sm">
          {data.map((d) => (
            <li key={d.status} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: colors[d.status] }}
              />
              <span className="text-body">{labels[d.status]}</span>
              <span className="text-muted">
                {d.count} ({total ? ((d.count / total) * 100).toFixed(1) : 0}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
