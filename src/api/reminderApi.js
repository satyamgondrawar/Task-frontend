const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://task-backend-1uvc.vercel.app";

const defaultOptions = {
  cache: "no-store",
  headers: {
    "Cache-Control": "no-cache",
  },
};

function createReminderApiError(message, code = "REQUEST_FAILED") {
  const error = new Error(message);
  error.code = code;
  return error;
}

async function requestReminder(path = "", options = {}) {
  const res = await fetch(`${BASE_URL}/reminders${path}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers ?? {}),
    },
  });

  if (res.status === 404) {
    throw createReminderApiError(
      "Reminders backend is not deployed yet. Redeploy the backend first.",
      "REMINDERS_API_MISSING"
    );
  }

  if (!res.ok) {
    throw createReminderApiError("Reminder request failed.");
  }

  return res;
}

export const fetchReminders = async () => {
  try {
    const res = await requestReminder();
    return res.json();
  } catch (error) {
    if (error.code === "REMINDERS_API_MISSING") {
      return [];
    }

    throw error;
  }
};

export const createReminder = async (reminder) => {
  const res = await requestReminder("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reminder),
  });

  return res.json();
};

export const updateReminder = async (id, reminder) => {
  const res = await requestReminder(`/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reminder),
  });

  return res.json();
};

export const deleteReminderApi = async (id) => {
  const res = await requestReminder(`/${id}`, {
    method: "DELETE",
  });

  return res.json();
};
