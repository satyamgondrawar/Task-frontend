import { useEffect, useMemo, useState } from "react";

import DashboardStats from "../components/DashboardStats";
import { useApp } from "../context/AppContext";
import {
  createTask,
  deleteTaskApi,
  fetchTasks,
  updateTask,
} from "../api/taskApi";

const sortTasksByDate = (taskList) => {
  return [...taskList].sort((firstTask, secondTask) => {
    const firstDate = new Date(
      firstTask.date || firstTask.createdAt || 0
    ).getTime();
    const secondDate = new Date(
      secondTask.date || secondTask.createdAt || 0
    ).getTime();

    if (firstDate !== secondDate) {
      return firstDate - secondDate;
    }

    return (
      new Date(secondTask.createdAt || 0).getTime() -
      new Date(firstTask.createdAt || 0).getTime()
    );
  });
};

const formatTaskDate = (value) => {
  if (!value) return "No due date";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function Tasks() {
  const { tasks, setTasks } = useApp();
  const [text, setText] = useState("");
  const [date, setDate] = useState("");
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  useEffect(() => {
    fetchTasks().then((taskData) => setTasks(sortTasksByDate(taskData)));
  }, [setTasks]);

  const sortedTasks = useMemo(() => sortTasksByDate(tasks), [tasks]);

  const allVisibleSelected =
    sortedTasks.length > 0 && selectedTaskIds.length === sortedTasks.length;

  const addTask = async () => {
    if (!text.trim()) return;

    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      date: date || null,
    };

    const saved = await createTask(newTask);
    setTasks((previous) => sortTasksByDate([...previous, saved]));
    setText("");
    setDate("");
  };

  const toggleTask = async (task) => {
    const updated = { ...task, completed: !task.completed };
    await updateTask(task.id, updated);
    setTasks((previous) =>
      sortTasksByDate(
        previous.map((item) => (item.id === task.id ? updated : item))
      )
    );
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTaskIds((previous) =>
      previous.includes(taskId)
        ? previous.filter((id) => id !== taskId)
        : [...previous, taskId]
    );
  };

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedTaskIds([]);
      return;
    }

    setSelectedTaskIds(sortedTasks.map((task) => task.id));
  };

  const deleteTask = async (id) => {
    await deleteTaskApi(id);
    setTasks((previous) => previous.filter((task) => task.id !== id));
    setSelectedTaskIds((previous) => previous.filter((taskId) => taskId !== id));
  };

  const deleteSelectedTasks = async () => {
    if (selectedTaskIds.length === 0) return;

    await Promise.all(selectedTaskIds.map((id) => deleteTaskApi(id)));
    setTasks((previous) =>
      previous.filter((task) => !selectedTaskIds.includes(task.id))
    );
    setSelectedTaskIds([]);
  };

  return (
    <div className="min-h-full bg-gray-100 p-4 sm:p-6">
      <h1 className="mb-1 text-2xl font-bold">Tasks</h1>
      <p className="mb-6 text-gray-500">
        Track your daily activities and goals
      </p>

      <DashboardStats />

      <div className="mt-6 rounded-3xl bg-white p-4 shadow-md sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Task Manager</h2>
            <p className="text-sm text-gray-500">
              Tasks are automatically sorted by due date.
            </p>
          </div>

          <button
            type="button"
            onClick={deleteSelectedTasks}
            disabled={selectedTaskIds.length === 0}
            className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete Selected ({selectedTaskIds.length})
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row">
          <input
            type="text"
            placeholder="Enter task..."
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="flex-1 rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400"
          />

          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400"
          />

          <button
            onClick={addTask}
            className="rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-slate-300"
            />
            Select all tasks
          </label>

          <span className="text-sm text-slate-500">
            {sortedTasks.length} total
          </span>
        </div>

        <div className="space-y-4">
          {sortedTasks.length === 0 ? (
            <p className="text-gray-500">No tasks yet...</p>
          ) : (
            sortedTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.includes(task.id)}
                    onChange={() => toggleTaskSelection(task.id)}
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                  />

                  <div>
                    <h3
                      className={`font-semibold ${
                        task.completed ? "text-gray-400 line-through" : "text-slate-900"
                      }`}
                    >
                      {task.text}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Due: {formatTaskDate(task.date)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => toggleTask(task)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                      task.completed ? "bg-green-500" : "bg-amber-500"
                    }`}
                  >
                    {task.completed ? "Done" : "Mark"}
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
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

