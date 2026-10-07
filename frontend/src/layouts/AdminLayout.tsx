import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div data-theme="admin" className="flex min-h-screen">
      {/* TODO: <Sidebar items={adminNav} /> */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
