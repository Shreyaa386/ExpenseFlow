import { Sliders, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/Card";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

function PreferencesCard({
  language,
  currency,
  onChange,
  onSave,
  loading,
}) {
  const languageOptions = [
    { value: "en", label: "English (en)" },
    { value: "hi", label: "Hindi (hi)" },
  ];

  const currencyOptions = [
    { value: "INR", label: "₹ INR (Indian Rupee)" },
    { value: "USD", label: "$ USD (US Dollar)" },
    { value: "EUR", label: "€ EUR (Euro)" },
    { value: "GBP", label: "£ GBP (British Pound)" },
  ];

  return (
    <Card className="p-5 sm:p-6">
      <CardHeader className="pb-3 border-b border-[#E8E7DE]">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sliders size={20} className="text-[#104E42]" />
            <span>Regional Preferences</span>
          </CardTitle>
          <CardDescription>
            Display currency symbols and UI localization. (Formatting only; does not convert transaction numbers)
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <Select
            label="Language"
            name="language"
            value={language}
            onChange={onChange}
            options={languageOptions}
          />

          <Select
            label="Default Currency Symbol"
            name="currency"
            value={currency}
            onChange={onChange}
            options={currencyOptions}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-[#E8E7DE]">
          <Button
            onClick={onSave}
            loading={loading}
            className="w-full sm:w-auto px-6 h-11 shadow-sm"
          >
            <Save size={16} className="mr-2" />
            <span>Save Preferences</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PreferencesCard;