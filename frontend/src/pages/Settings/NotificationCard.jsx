import { Bell } from "lucide-react";

function NotificationCard({
  notifications,
  onToggle,
  onSave,
  loading,
}) {
  const notificationItems = [
    {
      key: "emailNotifications",
      label: "Email Notifications",
      description: "Receive important updates via email.",
    },
    {
      key: "budgetAlerts",
      label: "Budget Alerts",
      description: "Get notified when you're close to your budget.",
    },
    {
      key: "monthlyReports",
      label: "Monthly Reports",
      description: "Receive monthly expense summaries.",
    },
    {
      key: "weeklySummary",
      label: "Weekly Summary",
      description: "Weekly overview of your spending.",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="text-indigo-600" size={22} />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Notifications
        </h2>
      </div>

      <div className="space-y-6">
        {notificationItems.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {item.label}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>

            <button
              onClick={() => onToggle(item.key)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                notifications[item.key]
                  ? "bg-indigo-600"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  notifications[item.key]
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onSave}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Notifications"}
        </button>
      </div>
    </div>
  );
}

export default NotificationCard;