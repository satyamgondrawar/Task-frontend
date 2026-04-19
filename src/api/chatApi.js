const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://task-backend-1uvc.vercel.app";

export const sendChatMessage = async (message) => {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("The chatbot service is unavailable right now.");
  }

  const data = await response.json();

  if (!data.reply) {
    throw new Error(data.error || "The chatbot returned an empty response.");
  }

  return data;
};
