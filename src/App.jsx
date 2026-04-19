import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Plans from "./pages/Plans";
import Layout from "./components/Layout";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="plans" element={<Plans />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="chat" element={<Chat />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
