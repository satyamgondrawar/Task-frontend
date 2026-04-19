import DashboardStats from "../components/DashboardStats";
import { useApp } from "../context/AppContext";
import { useEffect, useState } from "react";
import {
  fetchPlans,
  createPlan,
  updatePlan,
  deletePlanApi
} from "../api/planApi";

export default function Plans() {
  const { plans, setPlans } = useApp();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
  fetchPlans().then(setPlans);
}, []);
const addPlan = async () => {
  if (!title.trim()) return;

  const newPlan = {
    id: Date.now(),
    title,
    priority,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  const saved = await createPlan(newPlan);
  setPlans(prev => [saved, ...prev]);

  setTitle("");
};
const togglePlan = async (plan) => {
  const updated = { ...plan, completed: !plan.completed };

  await updatePlan(plan.id, updated);

  setPlans(plans.map(p => p.id === plan.id ? updated : p));
};
const deletePlan = async (id) => {
  await deletePlanApi(id);
  setPlans(plans.filter(p => p.id !== id));
};
    
  return (
    
    <div className="p-0">
        <div className="bg-gray-100 h-screen flex-1  p-6">
                      
            <h1 className="text-2xl font-bold mb-1">Plans</h1>
            <p className="text-gray-500 mb-6">
            Track your daily activities and goals
            </p>

            {/* Stats */}
            <DashboardStats />
        
      <h1 className="text-2xl font-bold pl-6 mt-6 mb-6">Plans</h1>

      {/* ➕ Add Plan */}
      <div className="bg-white p-4 rounded shadow mb-6 flex gap-3">
        <input
          type="text"
          placeholder="Enter plan..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 flex-1 rounded"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="border p-2 rounded"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button
          onClick={addPlan}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* 📋 Plans List */}
      <div className="space-y-4">
        {plans.length === 0 && (
          <p className="text-gray-500">No plans yet...</p>
        )}

        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h2
                className={`font-semibold ${
                  plan.completed ? "line-through text-gray-400" : ""
                }`}
              >
                {plan.title}
              </h2>

              <p className="text-sm text-gray-500">
                Priority: {plan.priority}
              </p>

              {/* 📊 Progress Bar */}
              <div className="w-64 bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${plan.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => togglePlan(plan)}
                className={`px-3 py-1 rounded text-white ${
                  plan.completed ? "bg-green-500" : "bg-yellow-500"
                }`}
              >
                {plan.completed ? "Done" : "Mark"}
              </button>

              <button
                onClick={() => deletePlan(plan.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}