import DashboardStats from "../components/DashboardStats";
import WeeklyChart from "../components/WeeklyActivity";
import OverallProgress from "../components/OverallProgress";
import { useApp } from "../context/AppContext";
import { getRecentItems } from "../utils/analytics";




export default function Dashboard() {
  const { tasks, plans } = useApp();

  // ✅ ADD HERE (inside component)
  const recentItems = getRecentItems(tasks, plans);

  return (
    <div className="bg-gray-100 min-h-full p-6">
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-6">Track your daily activities and goals</p>

      <DashboardStats />

      <div className="pt-7 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyChart />
        </div>

        <OverallProgress />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
        <h2 className="text-lg font-semibold mb-1">Recent Items</h2>
        <p className="text-sm text-gray-500 mb-4">
          Quick view of the latest tasks and plans you created
        </p>

        <div className="space-y-3">
          {recentItems.length === 0 ? (
            <p className="text-gray-400">No activity yet.</p>
          ) : (
            recentItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.type}</p>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
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
