import { UserCircle2, Globe, Wallet } from "lucide-react";

function ProfileHeader({ name, email, language, currency }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
            <UserCircle2 className="w-14 h-14 text-white" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {name}
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {email}
            </p>

            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Keep your personal information and preferences updated.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3">
            <Globe className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-500">Language</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {language === "en" ? "English" : "Hindi"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-gray-100 dark:bg-gray-800 px-4 py-3">
            <Wallet className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-500">Currency</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {currency}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;