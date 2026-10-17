import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getNotifications,
  markNotificationRead,
  markNotificationUnread,
  markAllNotificationsRead,
  deleteNotification as apiDeleteNotification,
  clearAllNotifications as apiClearAllNotifications,
} from "../services/notificationService";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [counts, setCounts] = useState({
    all: 0,
    unread: 0,
    budget: 0,
    transaction: 0,
    system: 0,
    budgetWarnings: 0,
    budgetExceeded: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(
    async (params = {}) => {
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      try {
        setLoading(true);
        const res = await getNotifications(params);
        if (res?.data) {
          setNotifications(res.data.notifications || []);
          setUnreadCount(res.data.unreadCount || 0);
          if (res.data.counts) {
            setCounts(res.data.counts);
          }
        }
      } catch (err) {
        console.error("Fetch notifications error:", err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Poll notifications periodically when user is authenticated
  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30s poll

    return () => clearInterval(interval);
  }, [user, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setCounts((prev) => ({
        ...prev,
        unread: Math.max(0, prev.unread - 1),
      }));
    } catch (err) {
      console.error("Mark as read error:", err);
      throw err;
    }
  };

  const markAsUnread = async (id) => {
    try {
      await markNotificationUnread(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: false } : n))
      );
      setUnreadCount((prev) => prev + 1);
      setCounts((prev) => ({
        ...prev,
        unread: prev.unread + 1,
      }));
    } catch (err) {
      console.error("Mark as unread error:", err);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      setCounts((prev) => ({
        ...prev,
        unread: 0,
      }));
    } catch (err) {
      console.error("Mark all as read error:", err);
      throw err;
    }
  };

  const deleteNotification = async (id) => {
    try {
      await apiDeleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      // Re-fetch to update accurate counts
      fetchNotifications();
    } catch (err) {
      console.error("Delete notification error:", err);
      throw err;
    }
  };

  const clearAll = async () => {
    try {
      await apiClearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      setCounts({
        all: 0,
        unread: 0,
        budget: 0,
        transaction: 0,
        system: 0,
        budgetWarnings: 0,
        budgetExceeded: 0,
      });
    } catch (err) {
      console.error("Clear all notifications error:", err);
      throw err;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        counts,
        loading,
        fetchNotifications,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
