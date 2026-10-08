// src/features/dashboard/pages/DashboardPage.tsx
import { LuFileText, LuMessageSquare, LuUsers, LuTarget } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";
import PageHeader from "@/layouts/PageHeader";
import StatCard from "@/components/ui/StatCard";
import PolicyStatusChart from "./components/PolicyStatusChart";
import RecentUploads from "./components/RecentUploads";
import RecentActivity from "./components/RecentActivity";
import { dashboardMock } from "./dashboard.mock";
import type { StatKey } from "./dashboard.types";

const statIcons = {
  policies: LuFileText,
  questions: LuMessageSquare,
  users: LuUsers,
  accuracy: LuTarget,
} satisfies Record<StatKey, typeof LuFileText>;

export default function DashboardPage() {
  // const { user } = useAuth();

  // TODO: replace the mock with getDashboardData() (useEffect + useState),
  // and handle loading and error states.
  const data = dashboardMock;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        // action={
        //   <div className="flex items-center gap-3">
        //     <span className="text-sm text-body">Hello, {user?.name}</span>
        //     <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-inverse">
        //       {user?.name.charAt(0).toUpperCase()}
        //     </div>
        //   </div>
        // }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={statIcons[stat.key]}
          />
        ))}
      </div>

      {/* Status chart + recent uploads */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PolicyStatusChart data={data.statusCounts} />
        <RecentUploads data={data.recentUploads} />
      </div>

      {/* Recent activity */}
      <div className="mt-4">
        <RecentActivity data={data.recentActivity} />
      </div>
    </div>
  );
}
