import { Outlet } from "react-router-dom";

export default function EmployeeLayout() {
  return (
    <div data-theme="employee" className="flex min-h-screen">
      {/* TODO: <Sidebar items={employeeNav} /> */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
