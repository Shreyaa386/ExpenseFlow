import { Moon, Sun, Monitor, CheckCircle2, Palette, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";

function ThemeCard({ theme, onChange, onSave, loading }) {
  const themes = [
    {
      id: "dark",
      label: "Dark Fintech",
      description: "Midnight navy palette optimized for data contrast",
      icon: Moon,
      color: "text-teal-500 dark:text-teal-400",
    },
    {
      id: "light",
      label: "Light Mode",
      description: "Clean, daylight appearance with soft slate neutrals",
      icon: Sun,
      color: "text-amber-500 dark:text-amber-400",
    },
    {
      id: "system",
      label: "System Sync",
      description: "Automatically matches your operating system setting",
      icon: Monitor,
      color: "text-cyan-500 dark:text-cyan-400",
    },
  ];

  return (
    <Card className="p-5 sm:p-6 min-h-full flex flex-col justify-between">
      <div>
        <CardHeader className="pb-4 border-b border-[#E8E7DE] dark:border-[#1E2D4A] mb-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette size={20} className="text-[#104E42] dark:text-[#00D09C]" />
              <span>Appearance & Theme</span>
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:text-sm text-[#66736E] dark:text-[#94A3B8]">
              Customize the visual style of your ExpenseFlow workspace
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 !p-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themes.map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.id;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onChange({ target: { value: t.id } })}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 relative cursor-pointer ${
                    isSelected
                      ? "border-[#087F68] dark:border-[#00D09C] bg-[#087F68]/10 dark:bg-[#00D09C]/15 ring-2 ring-[#087F68] dark:ring-[#00D09C] shadow-sm"
                      : "border-[#E8E7DE] dark:border-[#1E2D4A] bg-[#F8F7F0] dark:bg-[#0E172F] hover:border-[#D5D3C8] dark:hover:border-[#2E4369] hover:bg-[#F3F1E7] dark:hover:bg-[#162447]"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`Select ${t.label}`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-[#087F68] dark:text-[#00D09C]">
                      <CheckCircle2 size={18} />
                    </div>
                  )}

                  <div
                    className={`p-2.5 rounded-lg bg-[#FFFDF8] dark:bg-[#162447] border border-[#E8E7DE] dark:border-[#1E2D4A] ${t.color} mb-3`}
                  >
                    <Icon size={20} />
                  </div>

                  <span className="font-bold text-sm text-[#102A2A] dark:text-[#F8FAFC]">
                    {t.label}
                  </span>
                  <span className="text-xs text-[#66736E] dark:text-[#94A3B8] mt-1 leading-snug">
                    {t.description}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </div>

      <div className="flex justify-end pt-5 mt-5 border-t border-[#E8E7DE] dark:border-[#1E2D4A]">
        <Button
          onClick={onSave}
          loading={loading}
          className="w-full sm:w-auto px-6 h-11 shadow-sm"
        >
          <Save size={16} className="mr-2" />
          <span>Save Theme Preference</span>
        </Button>
      </div>
    </Card>
  );
}

export default ThemeCard;