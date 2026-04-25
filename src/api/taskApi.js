const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://task-backend-1uvc.vercel.app";

const defaultOptions = {
  cache: "no-store",
  headers: {
    "Cache-Control": "no-cache",
  },
};

// GET
export const fetchTasks = async () => {
  const res = await fetch(`${BASE_URL}/tasks`, defaultOptions);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

// POST
export const createTask = async (task) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    ...defaultOptions,
    method: "POST",
    headers: {
      ...defaultOptions.headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};

// PUT
export const updateTask = async (id, task) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    ...defaultOptions,
    method: "PUT",
    headers: {
      ...defaultOptions.headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};

// DELETE
export const deleteTaskApi = async (id) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    ...defaultOptions,
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
};
