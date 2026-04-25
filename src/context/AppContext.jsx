import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { fetchPlans } from "../api/planApi";
import { fetchReminders } from "../api/reminderApi";
import { fetchTasks } from "../api/taskApi";

const AppContext = createContext();
const notifiedStorageKey = "task-tracker-notified-reminders";

function getStoredNotifiedIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(notifiedStorageKey);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

function saveStoredNotifiedIds(ids) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(notifiedStorageKey, JSON.stringify(ids));
}

function removeStoredNotifiedId(id) {
  const remainingIds = getStoredNotifiedIds().filter((storedId) => storedId !== id);
  saveStoredNotifiedIds(remainingIds);
  return remainingIds;
}

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [remindersAvailable, setRemindersAvailable] = useState(true);
  const [remindersError, setRemindersError] = useState("");
  const [notificationPermission, setNotificationPermission] = useState(() =>
    typeof Notification === "undefined" ? "unsupported" : Notification.permission
  );
  const hasLoadedOnceRef = useRef(false);
  const notifiedIdsRef = useRef(getStoredNotifiedIds());

  const refreshData = useCallback(async (options = {}) => {
    const { silent = false } = options;

    if (!silent) {
      setLoadError("");
    }

    if (!hasLoadedOnceRef.current && !silent) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const [taskResult, planResult, reminderResult] = await Promise.allSettled([
        fetchTasks(),
        fetchPlans(),
        fetchReminders(),
      ]);

      if (taskResult.status === "rejected") {
        throw taskResult.reason;
      }

      if (planResult.status === "rejected") {
        throw planResult.reason;
      }

      setTasks(Array.isArray(taskResult.value) ? taskResult.value : []);
      setPlans(Array.isArray(planResult.value) ? planResult.value : []);

      if (reminderResult.status === "fulfilled") {
        setReminders(Array.isArray(reminderResult.value) ? reminderResult.value : []);
        setRemindersAvailable(true);
        setRemindersError("");
      } else if (reminderResult.reason?.code === "REMINDERS_API_MISSING") {
        setReminders([]);
        setRemindersAvailable(false);
        setRemindersError(reminderResult.reason.message);
      } else {
        setReminders([]);
        setRemindersAvailable(true);
        setRemindersError("Unable to refresh reminders right now.");
      }

      setLoadError("");
      hasLoadedOnceRef.current = true;
    } catch (error) {
      console.error("Failed to load app data", error);
      setLoadError("Unable to refresh your data right now.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    const handleWindowFocus = () => {
      if (typeof Notification !== "undefined") {
        setNotificationPermission(Notification.permission);
      }

      if (hasLoadedOnceRef.current) {
        refreshData({ silent: true });
      }
    };

    const intervalId = window.setInterval(() => {
      if (hasLoadedOnceRef.current && document.visibilityState === "visible") {
        refreshData({ silent: true });
      }
    }, 30000);

    window.addEventListener("focus", handleWindowFocus);
    document.addEventListener("visibilitychange", handleWindowFocus);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleWindowFocus);
      document.removeEventListener("visibilitychange", handleWindowFocus);
    };
  }, [refreshData]);

  useEffect(() => {
    const now = Date.now();
    const existingIds = new Set(notifiedIdsRef.current);
    let hasChanges = false;

    reminders.forEach((reminder) => {
      const dueTime = new Date(reminder.dueAt).getTime();

      if (
        reminder.completed ||
        Number.isNaN(dueTime) ||
        dueTime > now ||
        existingIds.has(reminder.id)
      ) {
        return;
      }

      const message = reminder.notes?.trim() || "Your reminder is due now.";

      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(reminder.title, {
          body: message,
          tag: `reminder-${reminder.id}`,
        });
      }

      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        navigator.vibrate([200, 120, 200]);
      }

      existingIds.add(reminder.id);
      hasChanges = true;
    });

    if (hasChanges) {
      const nextIds = [...existingIds];
      notifiedIdsRef.current = nextIds;
      saveStoredNotifiedIds(nextIds);
    }
  }, [reminders]);

  const requestNotificationPermission = useCallback(async () => {
    if (typeof Notification === "undefined") {
      setNotificationPermission("unsupported");
      return "unsupported";
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    return permission;
  }, []);

  const clearReminderNotification = useCallback((id) => {
    const nextIds = removeStoredNotifiedId(id);
    notifiedIdsRef.current = nextIds;
  }, []);

  return (
    <AppContext.Provider
      value={{
        tasks,
        setTasks,
        plans,
        setPlans,
        reminders,
        setReminders,
        isLoading,
        isRefreshing,
        loadError,
        remindersAvailable,
        remindersError,
        notificationPermission,
        requestNotificationPermission,
        clearReminderNotification,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  return useContext(AppContext);
};
