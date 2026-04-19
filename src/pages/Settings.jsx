import { useState } from "react";

export default function Settings() {
  const [name, setName] = useState("Satyam");
  const [email, setEmail] = useState("satyam@example.com");
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    const data = { name, email, theme, notifications };
    console.log("Saved Settings:", data);
    alert("Settings saved!");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      
      <h1 className="text-2xl font-semibold mb-6">⚙️ Settings</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-6">
        
        {/* Profile */}
        <div>
          <h2 className="text-lg font-medium mb-3">Profile</h2>

          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Theme */}
        <div>
          <h2 className="text-lg font-medium mb-3">Theme</h2>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Notifications</h2>

          <input
            type="checkbox"
            checked={notifications}
            onChange={() => setNotifications(!notifications)}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="bg-black text-white px-6 py-2 rounded-lg"
        >
          Save Changes
        </button>

      </div>
    </div>
  );
}