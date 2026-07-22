import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import { getCurrentUser } from "../services/authService";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();

        console.log("getCurrentUser Response:", response);

        setUser(response.data);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data)
        );
      } catch (error) {
        console.error("Auth Error:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);

    toast.success("Login Successful");
  };

  const updateUser = (userData) => {
    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    toast.success("Logged Out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        updateUser,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;