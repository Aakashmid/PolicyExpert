// src/components/layout/Sidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";
import { adminNav, employeeNav } from "./navItems";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const items = user.role === "admin" ? adminNav : employeeNav;

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  return (
    <aside
      data-theme={user.role}
      className="flex h-full w-full flex-col bg-sidebar"
    >
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-semibold text-inverse">
          P
        </div>
        <span className="font-semibold text-inverse">Policy Expert</span>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 mt-2">
        {items.map(({ title, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5  transition-colors ${
                isActive
                  ? "bg-primary text-inverse"
                  : "text-sidebar-text hover:bg-white/10"
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {title}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-white/10 p-3">
        <div className="mb-2 flex items-center gap-3 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary  font-medium text-inverse">
            {/* user avatar */}
            {user.first_name.charAt(0).toUpperCase()}
            {user.last_name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate  text-inverse">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-xs capitalize text-sidebar-muted">{user.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5  text-sidebar-text transition-colors hover:bg-white/10"
        >
          <LuLogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
