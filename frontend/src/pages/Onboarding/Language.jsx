import { useState } from "react";
import { Globe, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";

const languages = [
  {
    code: "en",
    name: "English",
    native: "English",
    flag: "🇬🇧",
  },
  {
    code: "hi",
    name: "Hindi",
    native: "हिन्दी",
    flag: "🇮🇳",
  },
  {
    code: "fr",
    name: "French",
    native: "Français",
    flag: "🇫🇷",
  },
  {
    code: "es",
    name: "Spanish",
    native: "Español",
    flag: "🇪🇸",
  },
];

function Language() {
  const navigate = useNavigate();

  const [selectedLanguage, setSelectedLanguage] = useState(
    sessionStorage.getItem("language") || ""
  );

  const handleContinue = () => {
    sessionStorage.setItem("language", selectedLanguage);
    navigate("/onboarding/currency");
  };

  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-[#66736E]">
          <span>Step 1 of 2</span>
          <span>50%</span>
        </div>

        <div className="h-2 rounded-full bg-[#E8E7DE]">
          <div className="h-full w-1/2 rounded-full bg-[#104E42]" />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#104E42]/10">
          <Globe className="h-8 w-8 text-[#104E42]" />
        </div>

        <h1 className="text-3xl font-bold text-[#102A2A]">
          Choose Your Language
        </h1>

        <p className="mt-3 text-sm text-[#66736E]">
          Select your preferred language for ExpenseFlow.
        </p>
      </div>

      {/* Language Cards */}
      <div className="space-y-4">
        {languages.map((language) => {
          const selected = selectedLanguage === language.code;

          return (
            <button
              key={language.code}
              onClick={() => setSelectedLanguage(language.code)}
              className={`flex w-full items-center justify-between rounded-2xl border p-5 transition-all duration-200 ${
                selected
                  ? "border-[#104E42] bg-[#104E42]/10 shadow-sm"
                  : "border-[#E8E7DE] bg-[#F8F7F0] hover:border-[#D5D3C8] hover:bg-[#F3F1E7]"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{language.flag}</span>

                <div className="text-left">
                  <h3 className="font-bold text-[#102A2A]">
                    {language.name}
                  </h3>

                  <p className="text-sm text-[#66736E]">
                    {language.native}
                  </p>
                </div>
              </div>

              {selected && (
                <CheckCircle className="h-6 w-6 text-[#104E42]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Continue */}
      <Button
        className="mt-10"
        disabled={!selectedLanguage}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </div>
  );
}

export default Language;