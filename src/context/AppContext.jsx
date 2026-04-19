import { createContext, useContext, useEffect, useState } from "react";
import { fetchPlans } from "../api/planApi";
import { fetchTasks } from "../api/taskApi";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAppData() {
      try {
        const [taskData, planData] = await Promise.all([
          fetchTasks(),
          fetchPlans(),
        ]);

        if (!isMounted) {
          return;
        }

        setTasks(Array.isArray(taskData) ? taskData : []);
        setPlans(Array.isArray(planData) ? planData : []);
      } catch (error) {
        if (isMounted) {
          console.error("Failed to load app data", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAppData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AppContext.Provider
      value={{ tasks, setTasks, plans, setPlans, isLoading }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  return useContext(AppContext);
};
