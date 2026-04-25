import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Activity,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
} from "lucide-react";
import WeeklyChart from "../components/WeeklyActivity";
import OverallProgress from "../components/OverallProgress";
import { useApp } from "../context/AppContext";
import {
  getOverviewStats,
  getPriorityBreakdown,
  getRecentItems,
} from "../utils/analytics";

const priorityColors = {
  High: "#dc2626",
  Medium: "#f59e0b",
  Low: "#16a34a",
};

export default function Analytics() {
  const { tasks, plans, reminders, isLoading } = useApp();
  const overview = getOverviewStats(tasks, plans, reminders);
  const priorityData = getPriorityBreakdown(plans).filter((item) => item.value > 0);
  const recentItems = getRecentItems(tasks, plans, reminders);
  const cards = [
    {
      title: "Tracked Items",
      value: overview.total,
      subtitle: `${overview.taskCount} tasks, ${overview.planCount} plans, ${overview.reminderCount} reminders`,
      icon: ClipboardList,
      accent: "bg-blue-50 text-blue-700",
    },
    {
      title: "Completion Rate",
      value: `${overview.completionRate}%`,
      subtitle: `${overview.completed} completed so far`,
      icon: CheckCircle2,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Active Plans",
      value: plans.filter((plan) => !plan.completed).length,
      subtitle: "Plans still in progress",
      icon: FolderKanban,
      accent: "bg-amber-50 text-amber-700",
    },
    {
      title: "Recent Activity",
      value: recentItems.length,
      subtitle: "Latest items shown below",
      icon: Activity,
      accent: "bg-cyan-50 text-cyan-700",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Analytics</h1>
        <p className="text-gray-500">
          Real metrics generated from your tasks and plans
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div key={card.title} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <h2 className="text-3xl font-bold mt-2">{card.value}</h2>
                  <p className="text-sm text-gray-500 mt-2">{card.subtitle}</p>
                </div>
                <div className={`p-3 rounded-2xl ${card.accent}`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <WeeklyChart />
        </div>
        <OverallProgress />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-1">Plan Priority Mix</h2>
          <p className="text-sm text-gray-500 mb-4">
            Distribution of current plan priorities
          </p>

          <div className="h-72">
            {priorityData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                Add plans with priorities to unlock this chart.
              </div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                  >
                    {priorityData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={priorityColors[entry.name] ?? "#2563eb"}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Latest Activity</h2>
              <p className="text-sm text-gray-500">
                Most recently created tasks and plans
              </p>
            </div>
            {isLoading && <span className="text-sm text-gray-400">Loading...</span>}
          </div>

          <div className="space-y-3">
            {recentItems.length === 0 ? (
              <p className="text-gray-400">
                No items yet. Create a task or plan to see activity.
              </p>
            ) : (
              recentItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.type}
                      {item.priority ? ` - ${item.priority} priority` : ""}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
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
    </div>
  );
}
