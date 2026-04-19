const BASE_URL = "https://task-backend-1uvc.vercel.app/";

// 📥 GET all plans
export const fetchPlans = async () => {
  const res = await fetch(`${BASE_URL}/plans`);
  if (!res.ok) throw new Error("Failed to fetch plans");
  return res.json();
};

// ➕ CREATE plan
export const createPlan = async (plan) => {
  const res = await fetch(`${BASE_URL}/plans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(plan),
  });

  if (!res.ok) throw new Error("Failed to create plan");
  return res.json();
};

// 🔄 UPDATE plan
export const updatePlan = async (id, plan) => {
  const res = await fetch(`${BASE_URL}/plans/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(plan),
  });

  if (!res.ok) throw new Error("Failed to update plan");
  return res.json();
};

// ❌ DELETE plan
export const deletePlanApi = async (id) => {
  const res = await fetch(`${BASE_URL}/plans/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete plan");
  return res.json();
};