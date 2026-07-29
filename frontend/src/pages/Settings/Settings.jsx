import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ThemeCard from "./ThemeCard";
import NotificationCard from "./NotificationCard";
import SecurityCard from "./SecurityCard";

import { getProfile } from "../../services/userService";
import {
  updateTheme,
  updateNotifications,
  changePassword,
} from "../../services/settingsService";

function Settings() {
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState("system");

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    monthlyReports: true,
    weeklySummary: false,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const response = await getProfile();
      const user = response.data;

      setTheme(user.theme || "system");

      setNotifications(
        user.notifications || {
          emailNotifications: true,
          budgetAlerts: true,
          monthlyReports: true,
          weeklySummary: false,
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveTheme = async () => {
    try {
      setLoading(true);

      await updateTheme(theme);

      toast.success("Theme updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update theme");
    } finally {
      setLoading(false);
    }
  };

  const saveNotifications = async () => {
    try {
      setLoading(true);

      await updateNotifications(notifications);

      toast.success("Notification settings updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update notifications");
    } finally {
      setLoading(false);
    }
  };

  const savePassword = async () => {
    try {
      if (
        !passwords.currentPassword ||
        !passwords.newPassword ||
        !passwords.confirmPassword
      ) {
        return toast.error("Please fill all password fields");
      }

      if (passwords.newPassword !== passwords.confirmPassword) {
        return toast.error("Passwords do not match");
      }

      setLoading(true);

      await changePassword(passwords);

      toast.success("Password changed successfully");

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pb-6 space-y-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <ThemeCard
          theme={theme}
          onChange={handleThemeChange}
          onSave={saveTheme}
          loading={loading}
        />

        <NotificationCard
          notifications={notifications}
          onToggle={handleNotificationToggle}
          onSave={saveNotifications}
          loading={loading}
        />

        <div className="xl:col-span-2">
          <SecurityCard
            passwords={passwords}
            onChange={handlePasswordChange}
            onSave={savePassword}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default Settings;