import { useState } from "react";

import DashboardStats from "../components/DashboardStats";
import { useApp } from "../context/AppContext";
import { createPlan, deletePlanApi, updatePlan } from "../api/planApi";

export default function Plans() {
  const {
    plans,
    setPlans,
    isLoading,
    isRefreshing,
    loadError,
    refreshData,
  } = useApp();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const addPlan = async () => {
    if (!title.trim()) return;

    const newPlan = {
      id: Date.now(),
      title,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setIsSaving(true);
    setActionError("");

    try {
      const saved = await createPlan(newPlan);
      setPlans((current) => [saved, ...current]);
      setTitle("");
      setPriority("Medium");
    } catch {
      setActionError("Unable to add the plan right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePlan = async (plan) => {
    const updated = { ...plan, completed: !plan.completed };
    const previousPlans = plans;

    setActionError("");
    setPlans((current) => current.map((item) => (item.id === plan.id ? updated : item)));

    try {
      await updatePlan(plan.id, updated);
    } catch {
      setPlans(previousPlans);
      setActionError("Unable to update the plan right now.");
    }
  };

  const deletePlan = async (id) => {
    const previousPlans = plans;

    setActionError("");
    setPlans((current) => current.filter((plan) => plan.id !== id));

    try {
      await deletePlanApi(id);
    } catch {
      setPlans(previousPlans);
      setActionError("Unable to delete the plan right now.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-full p-6">
      <h1 className="mb-1 text-2xl font-bold">Plans</h1>
      <p className="mb-6 text-gray-500">Track your daily activities and goals</p>

      <DashboardStats />

      <div className="mt-6 rounded-3xl bg-white p-4 shadow-md sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Plan Manager</h2>
            <p className="text-sm text-gray-500">
              Changes stay visible immediately and refresh in the background.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refreshData()}
            disabled={isLoading || isRefreshing}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {(loadError || actionError) && (
          <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError || loadError}
          </div>
        )}

        {isLoading && (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Loading your latest plans...
          </div>
        )}

        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row">
          <input
            type="text"
            placeholder="Enter plan..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="flex-1 rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400"
          />

          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button
            onClick={addPlan}
            disabled={isSaving}
            className="rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Add"}
          </button>
        </div>

        <div className="space-y-4">
          {plans.length === 0 ? (
            <p className="text-gray-500">No plans yet...</p>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2
                    className={`font-semibold ${
                      plan.completed ? "line-through text-gray-400" : "text-slate-900"
                    }`}
                  >
                    {plan.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Priority: {plan.priority}
                  </p>
                </div>

                <div className="flex gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => togglePlan(plan)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                      plan.completed ? "bg-green-500" : "bg-amber-500"
                    }`}
                  >
                    {plan.completed ? "Done" : "Mark"}
                  </button>

                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
