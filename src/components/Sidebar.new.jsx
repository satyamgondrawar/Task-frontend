import { BarChart3, Bot, ClipboardList, LayoutDashboard, Settings, Target, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: ClipboardList },
  { to: "/plans", label: "Plans", icon: Target },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/chat", label: "Chat", icon: Bot },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm transition lg:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-slate-950 text-slate-100 shadow-2xl transition duration-300 lg:static lg:z-auto lg:w-72 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-cyan-300">
              Task Tracker
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">Workspace</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-white/10 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 px-4 py-6">
          <div className="rounded-3xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 p-[1px] shadow-[0_20px_40px_rgba(14,165,233,0.25)]">
            <div className="rounded-3xl bg-slate-950/95 p-4">
              <p className="text-sm text-slate-300">Stay focused</p>
              <p className="mt-2 text-lg font-semibold text-white">
                Track plans, tasks, analytics, and AI help from one place.
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => {
              const isActive =
                location.pathname === to ||
                (to === "/dashboard" && location.pathname === "/");

              return (
                <Link
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-slate-950 shadow-lg"
                      : "text-slate-300 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
