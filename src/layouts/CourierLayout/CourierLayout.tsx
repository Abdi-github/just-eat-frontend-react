import { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Bike, Clock, Menu, X } from "lucide-react";

const courierLinks = [
  {
    to: "/courier/dashboard",
    icon: LayoutDashboard,
    label: "courier-dashboard:nav.dashboard",
  },
  { to: "/courier/active", icon: Bike, label: "courier-dashboard:nav.active" },
  {
    to: "/courier/history",
    icon: Clock,
    label: "courier-dashboard:nav.history",
  },
];

export function CourierLayout() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 transform border-r border-border bg-white transition-transform lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="just-eat.ch" className="h-7" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        <p className="px-4 -mt-2 text-xs text-muted-foreground">
          {t("nav.courierDashboard")}
        </p>
        <nav className="mt-4 space-y-1 px-2">
          {courierLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-accent"
                }`
              }
            >
              <link.icon size={18} />
              {t(link.label)}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <header className="flex h-14 items-center border-b border-border bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-lg font-semibold text-foreground">
              {t("nav.courierDashboard")}
            </h2>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
