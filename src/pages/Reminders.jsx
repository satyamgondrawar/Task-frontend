import { useMemo, useState } from "react";
import { AlarmClock, Bell, BellOff, CalendarClock } from "lucide-react";

import DashboardStats from "../components/DashboardStats";
import {
  createReminder,
  deleteReminderApi,
  updateReminder,
} from "../api/reminderApi";
import { useApp } from "../context/AppContext";

const sortReminders = (reminderList) =>
  [...reminderList].sort((firstReminder, secondReminder) => {
    const firstTime = new Date(firstReminder.dueAt || 0).getTime();
    const secondTime = new Date(secondReminder.dueAt || 0).getTime();
    return firstTime - secondTime;
  });

const formatReminderDate = (value) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "Invalid date";
  }

  return parsed.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getReminderState = (reminder) => {
  if (reminder.completed) {
    return {
      label: "Completed",
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  const dueTime = new Date(reminder.dueAt).getTime();
  const now = Date.now();

  if (Number.isNaN(dueTime)) {
    return {
      label: "Invalid time",
      className: "bg-rose-50 text-rose-700",
    };
  }

  if (dueTime <= now) {
    return {
      label: "Due now",
      className: "bg-rose-50 text-rose-700",
    };
  }

  const hoursUntilDue = (dueTime - now) / (1000 * 60 * 60);

  if (hoursUntilDue <= 24) {
    return {
      label: "Today",
      className: "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Upcoming",
    className: "bg-blue-50 text-blue-700",
  };
};

export default function Reminders() {
  const {
    reminders,
    setReminders,
    isLoading,
    isRefreshing,
    loadError,
    refreshData,
    notificationPermission,
    requestNotificationPermission,
    clearReminderNotification,
  } = useApp();
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const sortedReminders = useMemo(() => sortReminders(reminders), [reminders]);

  const addReminder = async () => {
    if (!title.trim() || !dueAt) {
      setActionError("Add a title and date/time for the reminder.");
      return;
    }

    const reminder = {
      id: Date.now(),
      title: title.trim(),
      notes: notes.trim() || null,
      completed: false,
      createdAt: new Date().toISOString(),
      dueAt: new Date(dueAt).toISOString(),
    };

    setIsSaving(true);
    setActionError("");

    try {
      const savedReminder = await createReminder(reminder);
      clearReminderNotification(savedReminder.id);
      setReminders((current) => sortReminders([...current, savedReminder]));
      setTitle("");
      setNotes("");
      setDueAt("");
    } catch {
      setActionError("Unable to add the reminder right now.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleReminder = async (reminder) => {
    const updatedReminder = {
      ...reminder,
      completed: !reminder.completed,
    };
    const previousReminders = reminders;

    setActionError("");
    if (!updatedReminder.completed) {
      clearReminderNotification(updatedReminder.id);
    }

    setReminders((current) =>
      sortReminders(
        current.map((item) =>
          item.id === reminder.id ? updatedReminder : item
        )
      )
    );

    try {
      await updateReminder(reminder.id, updatedReminder);
    } catch {
      setReminders(previousReminders);
      setActionError("Unable to update the reminder right now.");
    }
  };

  const deleteReminder = async (id) => {
    const previousReminders = reminders;

    setActionError("");
    clearReminderNotification(id);
    setReminders((current) => current.filter((reminder) => reminder.id !== id));

    try {
      await deleteReminderApi(id);
    } catch {
      setReminders(previousReminders);
      setActionError("Unable to delete the reminder right now.");
    }
  };

  const handleEnableNotifications = async () => {
    const permission = await requestNotificationPermission();

    if (permission === "denied") {
      setActionError("Browser notifications are blocked. Enable them in your browser settings.");
    } else if (permission === "unsupported") {
      setActionError("This device or browser does not support system notifications here.");
    } else {
      setActionError("");
    }
  };

  return (
    <div className="min-h-full bg-gray-100 p-4 sm:p-6">
      <h1 className="mb-1 text-2xl font-bold">Reminders</h1>
      <p className="mb-6 text-gray-500">
        Create dated reminders and get a browser popup when they are due.
      </p>

      <DashboardStats />

      <div className="mt-6 rounded-3xl bg-white p-4 shadow-md sm:p-6">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Reminder Center</h2>
            <p className="text-sm text-gray-500">
              Best results come after enabling notifications on this device.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleEnableNotifications}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {notificationPermission === "granted" ? <Bell size={16} /> : <BellOff size={16} />}
              {notificationPermission === "granted"
                ? "Notifications On"
                : "Enable Notifications"}
            </button>

            <button
              type="button"
              onClick={() => refreshData()}
              disabled={isLoading || isRefreshing}
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {(loadError || actionError) && (
          <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError || loadError}
          </div>
        )}

        {isLoading && (
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Loading your latest reminders...
          </div>
        )}

        <div className="mb-6 grid gap-3 rounded-2xl bg-slate-50 p-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_220px_auto]">
          <input
            type="text"
            placeholder="Reminder title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400"
          />

          <input
            type="text"
            placeholder="Optional note"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400"
          />

          <input
            type="datetime-local"
            value={dueAt}
            onChange={(event) => setDueAt(event.target.value)}
            className="rounded-xl border border-slate-200 p-3 outline-none transition focus:border-blue-400"
          />

          <button
            type="button"
            onClick={addReminder}
            disabled={isSaving}
            className="rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Add"}
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <AlarmClock size={16} />
          <span>
            Notification status:{" "}
            <strong className="font-semibold text-slate-900">{notificationPermission}</strong>
          </span>
          <span className="hidden text-slate-400 sm:inline">|</span>
          <span>
            System popups work best when this app stays open or installed in the browser.
          </span>
        </div>

        <div className="space-y-4">
          {sortedReminders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-slate-500">
              No reminders yet. Add one with a date and time above.
            </div>
          ) : (
            sortedReminders.map((reminder) => {
              const reminderState = getReminderState(reminder);

              return (
                <div
                  key={reminder.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3
                        className={`text-base font-semibold ${
                          reminder.completed ? "text-gray-400 line-through" : "text-slate-900"
                        }`}
                      >
                        {reminder.title}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${reminderState.className}`}
                      >
                        {reminderState.label}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <CalendarClock size={15} />
                      <span>{formatReminderDate(reminder.dueAt)}</span>
                    </div>

                    {reminder.notes ? (
                      <p className="mt-2 text-sm text-slate-600">{reminder.notes}</p>
                    ) : null}
                  </div>

                  <div className="flex gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => toggleReminder(reminder)}
                      className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                        reminder.completed ? "bg-slate-500" : "bg-emerald-500"
                      }`}
                    >
                      {reminder.completed ? "Reopen" : "Done"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteReminder(reminder.id)}
                      className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
