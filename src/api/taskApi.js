const BASE_URL = "https://task-backend-1uvc.vercel.app";

// GET
export const fetchTasks = async () => {
  const res = await fetch(`${BASE_URL}/tasks`);
  return res.json();
};

// POST
export const createTask = async (task) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
};

// PUT
export const updateTask = async (id, task) => {
  await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
};

// DELETE
export const deleteTaskApi = async (id) => {
  await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
};