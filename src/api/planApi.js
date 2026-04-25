const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://task-backend-1uvc.vercel.app";

const defaultOptions = {
  cache: "no-store",
  headers: {
    "Cache-Control": "no-cache",
  },
};

export const fetchPlans = async () => {
  const res = await fetch(`${BASE_URL}/plans`, defaultOptions);
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
};

export const createPlan = async (plan) => {
  const res = await fetch(`${BASE_URL}/plans`, {
    ...defaultOptions,
    method: "POST",
    headers: {
      ...defaultOptions.headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(plan),
  });

  if (!res.ok) throw new Error("Failed to create plan");
  return res.json();
};

export const updatePlan = async (id, plan) => {
  const res = await fetch(`${BASE_URL}/plans/${id}`, {
    ...defaultOptions,
    method: "PUT",
    headers: {
      ...defaultOptions.headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(plan),
  });

  if (!res.ok) throw new Error("Failed to update plan");
  return res.json();
};

export const deletePlanApi = async (id) => {
  const res = await fetch(`${BASE_URL}/plans/${id}`, {
    ...defaultOptions,
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete plan");
  return res.json();
};
