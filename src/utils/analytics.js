const priorityLevels = ["High", "Medium", "Low"];

function toDate(value) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function startOfDay(date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

export function getOverviewStats(tasks = [], plans = []) {
  const allItems = [...tasks, ...plans];
  const total = allItems.length;
  const completed = allItems.filter((item) => item.completed).length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    pending,
    completionRate,
    taskCount: tasks.length,
    planCount: plans.length,
  };
}

export function getWeeklyActivity(tasks = [], plans = []) {
  const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const items = [
    ...tasks.map((task) => ({ ...task, itemType: "Task" })),
    ...plans.map((plan) => ({ ...plan, itemType: "Plan" })),
  ];
  const today = startOfDay(new Date());

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    const dayItems = items.filter((item) => {
      const createdDate = toDate(item.createdAt);
      return createdDate && startOfDay(createdDate).getTime() === date.getTime();
    });

    return {
      day: formatter.format(date),
      tasks: dayItems.filter((item) => item.itemType === "Task").length,
      plans: dayItems.filter((item) => item.itemType === "Plan").length,
    };
  });
}

export function getPriorityBreakdown(plans = []) {
  return priorityLevels.map((priority) => ({
    name: priority,
    value: plans.filter((plan) => plan.priority === priority).length,
  }));
}

export function getRecentItems(tasks = [], plans = []) {
  return [...tasks, ...plans]
    .map((item) => ({
      id: item.id,
      label: item.text ?? item.title ?? "Untitled item",
      completed: Boolean(item.completed),
      type: item.text ? "Task" : "Plan",
      createdAt: item.createdAt,
      priority: item.priority ?? null,
    }))
    .sort((a, b) => {
      const aDate = toDate(a.createdAt)?.getTime() ?? 0;
      const bDate = toDate(b.createdAt)?.getTime() ?? 0;
      return bDate - aDate;
    })
    .slice(0, 5);
}
