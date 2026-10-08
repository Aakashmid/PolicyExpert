// src/components/ui/StatCard.tsx
import type { IconType } from "react-icons";
import Card from "./Card";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: IconType;
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-muted">{title}</p>
        <p className="text-2xl font-semibold text-heading">{value}</p>
        {change && <p className="text-xs text-success">{change}</p>}
      </div>
    </Card>
  );
}
