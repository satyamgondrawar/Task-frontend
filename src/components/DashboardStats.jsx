import { CheckCircle, Clock, ListTodo, TrendingUp } from "lucide-react";
import { useApp } from "../context/AppContext";

  

export default function DashboardStats() {
  // ✅ 1. Get data FIRST
  const { tasks, plans } = useApp();

  // ✅ 2. Calculate FIRST
  const total = tasks.length + plans.length;

  const completed =
    tasks.filter(t => t.completed).length +
    plans.filter(p => p.completed).length;

  const pending = total - completed;

  const completionRate =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  // ✅ 3. THEN create stats
  const stats = [
    {
      title: "Total Tasks",
      value: total,
      icon: <ListTodo />,
      color: "bg-purple-500",
    },
    {
      title: "Completed",
      value: completed,
      icon: <CheckCircle />,
      color: "bg-green-500",
    },
    {
      title: "Pending",
      value: pending,
      icon: <Clock />,
      color: "bg-orange-500",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: <TrendingUp />,
      color: "bg-indigo-500",
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-5 flex justify-between items-center hover:shadow-gray-400 transition-shadow duration-300"
        >
          {/* Left Content */}
          <div>
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h2 className="text-2xl font-bold">{item.value}</h2>
            <p className="text-green-500 text-sm">{item.change}</p>
          </div>

          {/* Icon */}
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-xl text-white ${item.color}`}
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}