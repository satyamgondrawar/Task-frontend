import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApp } from "../context/AppContext";
import { getWeeklyActivity } from "../utils/analytics";

export default function WeeklyChart() {
  const { tasks, plans, reminders, isLoading } = useApp();
  const data = getWeeklyActivity(tasks, plans, reminders);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Weekly Activity</h2>
          <p className="text-sm text-gray-500">
            Items created over the last 7 days
          </p>
        </div>
        {isLoading && <span className="text-sm text-gray-400">Loading...</span>}
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="tasks" name="Tasks" fill="#2563eb" radius={[10, 10, 0, 0]} />
            <Bar dataKey="plans" name="Plans" fill="#0f766e" radius={[10, 10, 0, 0]} />
            <Bar dataKey="reminders" name="Reminders" fill="#f97316" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
