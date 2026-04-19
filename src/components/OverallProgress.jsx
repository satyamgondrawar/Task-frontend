import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { useApp } from "../context/AppContext";
import { getOverviewStats } from "../utils/analytics";

export default function OverallProgress() {
  const { tasks, plans } = useApp();
  const { completed, pending, completionRate } = getOverviewStats(tasks, plans);
  const data = [
    {
      name: "Progress",
      value: completionRate,
      fill: "#2563eb",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-1">Overall Progress</h2>
      <p className="text-sm text-gray-500 mb-4">Live completion based on your data</p>

      <div className="flex flex-col items-center">
        <RadialBarChart
          width={220}
          height={220}
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          barSize={14}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar background dataKey="value" cornerRadius={10} />
        </RadialBarChart>

        <div className="-mt-32 text-center">
          <h1 className="text-3xl font-bold">{completionRate}%</h1>
          <p className="text-gray-500 text-sm">Completed</p>
        </div>

        <div className="flex gap-4 mt-14 text-sm">
          <p className="text-blue-600">Done ({completed})</p>
          <p className="text-gray-400">Left ({pending})</p>
        </div>

        <div className="hidden gap-4 mt-14 text-sm">
          <p className="text-indigo-500">● Done (36)</p>
          <p className="text-gray-400">● Left (12)</p>
        </div>
      </div>
    </div>
  );
}
