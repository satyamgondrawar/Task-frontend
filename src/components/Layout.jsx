import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const titles = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/tasks": "Tasks",
  "/plans": "Plans",
  "/reminders": "Reminders",
  "/analytics": "Analytics",
  "/chat": "Chatbot",
  "/settings": "Settings",
};

export default function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const title = useMemo(
    () => titles[location.pathname] ?? "Tracker",
    [location.pathname]
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar
            title={title}
            onMenuClick={() => setIsSidebarOpen((current) => !current)}
          />

          <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

