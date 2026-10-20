import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Settings as SettingsIcon } from "lucide-react";

import ThemeCard from "./ThemeCard";
import NotificationCard from "./NotificationCard";
import SecurityCard from "./SecurityCard";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../services/userService";
import {
  updateTheme as apiUpdateTheme,
  updateNotifications,
  changePassword,
} from "../../services/settingsService";

function Settings() {
  const { theme: activeTheme, setTheme: setActiveTheme } = useTheme();
  const { updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const [theme, setTheme] = useState(activeTheme || "system");

  // Keep local state aligned if theme changes from another tab/control
  useEffect(() => {
    if (activeTheme) {
      setTheme(activeTheme);
    }
  }, [activeTheme]);

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

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getProfile();
      const user = response.data || response.user || {};

      if (user.theme && ["light", "dark", "system"].includes(user.theme)) {
        setTheme(user.theme);
        setActiveTheme(user.theme);
      }

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
  }, [setActiveTheme]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
    setActiveTheme(selectedTheme);
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

      const res = await apiUpdateTheme(theme);
      setActiveTheme(theme);
      if (res?.data) {
        updateUser(res.data);
      }

      toast.success("Theme preference saved successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update theme");
    } finally {
      setLoading(false);
    }
  };

  const saveNotifications = async () => {
    try {
      setLoading(true);

      const res = await updateNotifications(notifications);
      if (res?.data) {
        updateUser(res.data);
      }

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
        return toast.error("Please fill in all password fields");
      }

      if (passwords.newPassword.length < 8) {
        return toast.error("New password must be at least 8 characters");
      }

      if (passwords.newPassword !== passwords.confirmPassword) {
        return toast.error("New passwords do not match");
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
    <div className="space-y-6 sm:space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A2A] flex items-center gap-2.5">
            <SettingsIcon className="text-[#104E42]" size={28} />
            <span>Workspace Settings</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#66736E] font-medium">
            Control application appearance, notification dispatches, and credentials
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
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

        <div className="lg:col-span-2">
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