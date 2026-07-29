import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProfileHeader from "./ProfileHeader";
import PersonalInfoCard from "./PersonalInfoCard";
import FinancialGoalsCard from "./FinancialGoalsCard";
import PreferencesCard from "./PreferencesCard";

import {
  getProfile,
  updateProfile,
  updatePreferences,
} from "../../services/userService";

function Profile() {
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    monthlyIncome: "",
    monthlySavingGoal: "",
    language: "en",
    currency: "INR",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await getProfile();
      const user = response.user || response.data || {};

      setProfile({
        name: user.name || "",
        email: user.email || "",
        monthlyIncome: user.monthlyIncome || "",
        monthlySavingGoal: user.monthlySavingGoal || "",
        language: user.language || "en",
        currency: user.currency || "INR",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileSave = async () => {
    try {
      setLoading(true);

      await updateProfile({
        name: profile.name,
        monthlyIncome: Number(profile.monthlyIncome),
        monthlySavingGoal: Number(profile.monthlySavingGoal),
      });

      await fetchProfile();

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceSave = async () => {
    try {
      setLoading(true);

      await updatePreferences({
        language: profile.language,
        currency: profile.currency,
      });

      await fetchProfile();

      toast.success("Preferences updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pb-6 space-y-8">
      <ProfileHeader
        name={profile.name}
        email={profile.email}
        language={profile.language}
        currency={profile.currency}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <PersonalInfoCard
          name={profile.name}
          email={profile.email}
          onChange={handleChange}
          onSave={handleProfileSave}
          loading={loading}
        />

        <FinancialGoalsCard
          monthlyIncome={profile.monthlyIncome}
          monthlySavingGoal={profile.monthlySavingGoal}
          onChange={handleChange}
          onSave={handleProfileSave}
          loading={loading}
        />

        <div className="xl:col-span-2">
          <PreferencesCard
            language={profile.language}
            currency={profile.currency}
            onChange={handleChange}
            onSave={handlePreferenceSave}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;