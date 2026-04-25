import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { fetchPlans } from "../api/planApi";
import { fetchTasks } from "../api/taskApi";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const hasLoadedOnceRef = useRef(false);

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
      const [taskData, planData] = await Promise.all([fetchTasks(), fetchPlans()]);

      setTasks(Array.isArray(taskData) ? taskData : []);
      setPlans(Array.isArray(planData) ? planData : []);
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

  return (
    <AppContext.Provider
      value={{
        tasks,
        setTasks,
        plans,
        setPlans,
        isLoading,
        isRefreshing,
        loadError,
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
