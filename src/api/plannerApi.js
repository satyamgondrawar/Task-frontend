const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://task-backend-1uvc.vercel.app";

export const generateDayWiseTasks = async (content, days) => {
  const response = await fetch(`${BASE_URL}/plan-tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, days }),
  });

  if (!response.ok) {
    throw new Error("Unable to generate daily tasks right now.");
  }

  return response.json();
};
