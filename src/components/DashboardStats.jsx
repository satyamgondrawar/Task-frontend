import { CheckCircle, Clock, ListTodo, TrendingUp } from "lucide-react";

import { useApp } from "../context/AppContext";

export default function DashboardStats() {
  const { tasks, plans, reminders } = useApp();
  const total = tasks.length + plans.length + reminders.length;
  const completed =
    tasks.filter((task) => task.completed).length +
    plans.filter((plan) => plan.completed).length +
    reminders.filter((reminder) => reminder.completed).length;
  const pending = total - completed;
  const completionRate =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  const stats = [
    {
      title: "Tracked Items",
      value: total,
      icon: <ListTodo />,
      color: "bg-blue-500",
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.title}
          className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-md transition-shadow duration-300 hover:shadow-gray-400"
        >
          <div>
            <p className="text-sm text-gray-500">{item.title}</p>
            <h2 className="text-2xl font-bold">{item.value}</h2>
          </div>

          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${item.color}`}
          >
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
