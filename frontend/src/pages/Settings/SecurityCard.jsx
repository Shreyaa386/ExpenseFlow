import { useState } from "react";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";

function SecurityCard({
  passwords,
  onChange,
  onSave,
  loading,
}) {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const passwordFields = [
    {
      key: "currentPassword",
      label: "Current Password",
      visible: showPassword.current,
      toggle: "current",
    },
    {
      key: "newPassword",
      label: "New Password",
      visible: showPassword.new,
      toggle: "new",
    },
    {
      key: "confirmPassword",
      label: "Confirm Password",
      visible: showPassword.confirm,
      toggle: "confirm",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <LockKeyhole className="text-indigo-600" size={22} />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Security
        </h2>
      </div>

      <div className="space-y-5">
        {passwordFields.map((field) => (
          <div key={field.key}>
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </label>

            <div className="relative">
              <input
                type={field.visible ? "text" : "password"}
                name={field.key}
                value={passwords[field.key]}
                onChange={onChange}
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 pr-12 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />

              <button
                type="button"
                onClick={() => toggleVisibility(field.toggle)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              >
                {field.visible ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onSave}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-60"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>
    </div>
  );
}

export default SecurityCard;