import { Bell, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

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
      description: "Receive critical security and transaction alerts via email",
    },
    {
      key: "budgetAlerts",
      label: "Budget Limit Warnings",
      description: "Get notified when spending reaches 85% and 100% of category caps",
    },
    {
      key: "monthlyReports",
      label: "Monthly Financial Statements",
      description: "Receive comprehensive end-of-month cash flow recaps",
    },
    {
      key: "weeklySummary",
      label: "Weekly Spend Summary",
      description: "Compact weekly snapshot comparing outflow to previous period",
    },
  ];

  return (
    <Card className="p-5 sm:p-6 min-h-full flex flex-col justify-between">
      <div>
        <CardHeader className="pb-4 border-b border-[#E8E7DE] mb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell size={20} className="text-[#104E42] dark:text-[#00D09C]" />
              <span>Notification Preferences</span>
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:text-sm text-[#66736E] dark:text-[#94A3B8]">
              Choose what alerts and automated summaries ExpenseFlow sends you
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 !p-0">
          <div className="divide-y divide-[#E8E7DE] dark:divide-[#1E2D4A]">
            {notificationItems.map((item) => {
              const isEnabled = !!notifications[item.key];

              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="pr-4">
                    <h4 className="text-sm font-bold text-[#102A2A] dark:text-[#F8FAFC]">
                      {item.label}
                    </h4>
                    <p className="text-xs text-[#66736E] dark:text-[#94A3B8] mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    onClick={() => onToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#087F68]/50 ${
                      isEnabled
                        ? "bg-[#104E42] dark:bg-[#00D09C]"
                        : "bg-[#E8E7DE] dark:bg-[#1E2D4A]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </div>

      <div className="flex justify-end pt-5 mt-5 border-t border-[#E8E7DE]">
        <Button
          onClick={onSave}
          loading={loading}
          className="w-full sm:w-auto px-6 h-11 shadow-sm"
        >
          <Save size={16} className="mr-2" />
          <span>Save Notifications</span>
        </Button>
      </div>
    </Card>
  );
}

export default NotificationCard;