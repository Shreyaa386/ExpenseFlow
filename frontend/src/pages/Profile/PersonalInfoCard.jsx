function PersonalInfoCard({
  name,
  email,
  onChange,
  onSave,
 loading,
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Personal Information
      </h2>

      <div className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Enter your name"
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            readOnly
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-4 py-3 text-gray-500 dark:text-gray-400 cursor-not-allowed"
          />
        </div>

        <button
          onClick={onSave}
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors py-3 text-white font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Personal Information"}
        </button>
      </div>
    </div>
  );
}

export default PersonalInfoCard;