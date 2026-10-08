// AdminLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    // Todo: add collapse for smaller screen
    <div data-theme="admin" className="flex h-screen">
      <div className="hidden lg:block lg:w-64 shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
