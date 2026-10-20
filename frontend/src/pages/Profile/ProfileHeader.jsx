import { UserCircle2, Globe, Wallet, ShieldCheck } from "lucide-react";
import { Card } from "../../components/ui/Card";

function ProfileHeader({ name, email, language, currency }) {
  return (
    <Card hover={false} className="p-6 sm:p-7 bg-[#FFFDF8] dark:bg-[#111C38] border-[#E8E7DE] dark:border-[#1E2D4A] relative overflow-hidden shadow-xs">
      {/* Background ambient warmth */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#D99016]/5 dark:bg-[#00D09C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#104E42] via-[#176453] to-[#087F68] dark:from-[#087F68] dark:to-[#00D09C] flex items-center justify-center shadow-md border border-[#104E42]/20 flex-shrink-0 text-white">
            <UserCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#102A2A] dark:text-[#F8FAFC]">
                {name || "User Profile"}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#087F68]/10 dark:bg-[#00D09C]/15 text-[#087F68] dark:text-[#00D09C] border border-[#087F68]/20 dark:border-[#00D09C]/30">
                <ShieldCheck size={12} />
                Verified
              </span>
            </div>

            <p className="text-[#66736E] dark:text-[#94A3B8] text-xs sm:text-sm mt-1">
              {email}
            </p>

            <p className="mt-1 text-xs text-[#66736E] dark:text-[#94A3B8]">
              Manage your personal info, financial targets, and application preferences.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto shrink-0">
          <div className="flex items-center gap-3 rounded-xl bg-[#F8F7F0] dark:bg-[#0E172F] border border-[#E8E7DE] dark:border-[#1E2D4A] px-4 py-3 flex-1 md:flex-initial min-w-[130px]">
            <div className="p-2 rounded-lg bg-[#104E42]/10 dark:bg-[#00D09C]/15 text-[#104E42] dark:text-[#00D09C] shrink-0">
              <Globe size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">Language</p>
              <p className="text-sm font-bold text-[#102A2A] dark:text-[#F8FAFC]">
                {language === "hi" ? "Hindi (hi)" : "English (en)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-[#F8F7F0] dark:bg-[#0E172F] border border-[#E8E7DE] dark:border-[#1E2D4A] px-4 py-3 flex-1 md:flex-initial min-w-[130px]">
            <div className="p-2 rounded-lg bg-[#087F68]/10 dark:bg-[#00D09C]/15 text-[#087F68] dark:text-[#00D09C] shrink-0">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#66736E] dark:text-[#94A3B8]">Currency</p>
              <p className="text-sm font-bold text-[#087F68] dark:text-[#00D09C] font-mono">
                {currency || "INR"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ProfileHeader;