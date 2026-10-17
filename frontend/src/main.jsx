import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App";

import AuthProvider from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TransactionProvider>
            <NotificationProvider>
              <App />
            </NotificationProvider>

            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3500,
                style: {
                  borderRadius: "14px",
                  background: "#111B2E",
                  color: "#F1F5F9",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(12px)",
                  fontSize: "14px",
                },
              }}
            />
          </TransactionProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);