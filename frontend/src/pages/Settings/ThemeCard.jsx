import { Moon, Sun, Monitor } from "lucide-react";

function ThemeCard({ theme, onChange, onSave, loading }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Moon className="text-indigo-600" size={22} />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Appearance
        </h2>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="theme"
            value="light"
            checked={theme === "light"}
            onChange={onChange}
            className="accent-indigo-600"
          />
          <Sun size={20} />
          <span className="text-gray-700 dark:text-gray-300">
            Light Theme
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={theme === "dark"}
            onChange={onChange}
            className="accent-indigo-600"
          />
          <Moon size={20} />
          <span className="text-gray-700 dark:text-gray-300">
            Dark Theme
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="theme"
            value="system"
            checked={theme === "system"}
            onChange={onChange}
            className="accent-indigo-600"
          />
          <Monitor size={20} />
          <span className="text-gray-700 dark:text-gray-300">
            System Default
          </span>
        </label>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onSave}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Theme"}
        </button>
      </div>
    </div>
  );
}

export default ThemeCard;