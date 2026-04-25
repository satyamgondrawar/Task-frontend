const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://task-backend-1uvc.vercel.app";

const defaultOptions = {
  cache: "no-store",
  headers: {
    "Cache-Control": "no-cache",
  },
};

export const fetchReminders = async () => {
  const res = await fetch(`${BASE_URL}/reminders`, defaultOptions);
  if (!res.ok) throw new Error("Failed to fetch reminders");
  return res.json();
};

export const createReminder = async (reminder) => {
  const res = await fetch(`${BASE_URL}/reminders`, {
    ...defaultOptions,
    method: "POST",
    headers: {
      ...defaultOptions.headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reminder),
  });

  if (!res.ok) throw new Error("Failed to create reminder");
  return res.json();
};

export const updateReminder = async (id, reminder) => {
  const res = await fetch(`${BASE_URL}/reminders/${id}`, {
    ...defaultOptions,
    method: "PUT",
    headers: {
      ...defaultOptions.headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reminder),
  });

  if (!res.ok) throw new Error("Failed to update reminder");
  return res.json();
};

export const deleteReminderApi = async (id) => {
  const res = await fetch(`${BASE_URL}/reminders/${id}`, {
    ...defaultOptions,
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete reminder");
  return res.json();
};
