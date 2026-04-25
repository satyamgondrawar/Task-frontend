import DashboardStats from "../components/DashboardStats";
import OverallProgress from "../components/OverallProgress";
import WeeklyChart from "../components/WeeklyActivity";
import { useApp } from "../context/AppContext";
import { getRecentItems } from "../utils/analytics";

export default function Dashboard() {
  const { tasks, plans, reminders } = useApp();
  const recentItems = getRecentItems(tasks, plans, reminders);

  return (
    <div className="min-h-full bg-gray-100 p-6">
      <h1 className="mb-1 text-2xl font-bold">Dashboard</h1>
      <p className="mb-6 text-gray-500">Track your daily activities and goals</p>

      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 pt-7 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyChart />
        </div>

        <OverallProgress />
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
        <h2 className="mb-1 text-lg font-semibold">Recent Items</h2>
        <p className="mb-4 text-sm text-gray-500">
          Quick view of the latest tasks, plans, and reminders you created
        </p>

        <div className="space-y-3">
          {recentItems.length === 0 ? (
            <p className="text-gray-400">No activity yet.</p>
          ) : (
            recentItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.type}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    item.completed
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {item.completed ? "Completed" : "Pending"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
