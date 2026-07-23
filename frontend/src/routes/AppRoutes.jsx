import { Routes, Route } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import OnboardingLayout from "../layouts/OnboardingLayout";

import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

import Welcome from "../pages/Onboarding/Welcome";
import Language from "../pages/Onboarding/Language";
import Currency from "../pages/Onboarding/Currency";

import Dashboard from "../pages/Dashboard/Dashboard";

import Transactions from "../pages/Transactions/Transactions";
import AddTransaction from "../pages/Transactions/AddTransaction";
import EditTransaction from "../pages/Transactions/EditTransaction";

import Categories from "../pages/Categories/Categories";
import Analytics from "../pages/Analytics/Analytics";
import Profile from "../pages/Profile/Profile";

import NotFound from "../pages/NotFound/NotFound";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Onboarding */}
        <Route element={<OnboardingLayout />}>
          <Route
            path="/onboarding/welcome"
            element={<Welcome />}
          />

          <Route
            path="/onboarding/language"
            element={<Language />}
          />

          <Route
            path="/onboarding/currency"
            element={<Currency />}
          />
        </Route>

        {/* Main Application */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />

          <Route
            path="/transactions"
            element={<Transactions />}
          />

          <Route
            path="/transactions/add"
            element={<AddTransaction />}
          />

          <Route
            path="/transactions/edit/:id"
            element={<EditTransaction />}
          />

          <Route
            path="/categories"
            element={<Categories />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;