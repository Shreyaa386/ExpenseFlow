import { useState } from "react";
import { DollarSign, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Button from "../../components/ui/Button";
import { updatePreferences } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

const currencies = [
  {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    flag: "🇮🇳",
  },
  {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    flag: "🇺🇸",
  },
  {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    flag: "🇪🇺",
  },
  {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    flag: "🇬🇧",
  },
];

function Currency() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const [selectedCurrency, setSelectedCurrency] = useState(
    sessionStorage.getItem("currency") || ""
  );

  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    try {
      setLoading(true);

      const language = sessionStorage.getItem("language");

      console.log("========== ExpenseFlow Debug ==========");
      console.log("Language from Session:", language);
      console.log("Selected Currency:", selectedCurrency);

      const payload = {
        language,
        currency: selectedCurrency,
      };

      console.log("Request Payload:", payload);

      const response = await updatePreferences(payload);

      console.log("API Response:", response);

      updateUser(response.data);

      sessionStorage.removeItem("language");
      sessionStorage.removeItem("currency");

      toast.success("Preferences saved successfully 🎉");

      navigate("/");
    } catch (error) {
      console.error("Update Preferences Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to save preferences."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
          <span>Step 2 of 2</span>
          <span>100%</span>
        </div>

        <div className="h-2 rounded-full bg-slate-200">
          <div className="h-full w-full rounded-full bg-[#12C29D]" />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#12C29D]/10">
          <DollarSign className="h-8 w-8 text-[#12C29D]" />
        </div>

        <h1 className="text-3xl font-bold text-[#081B33]">
          Choose Your Currency
        </h1>

        <p className="mt-3 text-slate-500">
          Select the currency used for all your expenses and income.
        </p>
      </div>

      {/* Currency Cards */}
      <div className="space-y-4">
        {currencies.map((currency) => {
          const selected = selectedCurrency === currency.code;

          return (
            <button
              key={currency.code}
              type="button"
              onClick={() => {
                console.log("Currency Selected:", currency.code);
                setSelectedCurrency(currency.code);
              }}
              className={`flex w-full items-center justify-between rounded-2xl border p-5 transition-all duration-200 ${
                selected
                  ? "border-[#12C29D] bg-[#12C29D]/10 shadow-md"
                  : "border-slate-200 bg-white hover:border-[#12C29D]/40 hover:shadow"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{currency.flag}</span>

                <div className="text-left">
                  <h3 className="font-semibold text-[#081B33]">
                    {currency.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {currency.symbol} ({currency.code})
                  </p>
                </div>
              </div>

              {selected && (
                <CheckCircle className="h-6 w-6 text-[#12C29D]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Finish Button */}
      <Button
        className="mt-10"
        disabled={!selectedCurrency || loading}
        onClick={handleFinish}
      >
        {loading ? "Saving..." : "Finish Setup"}
      </Button>
    </div>
  );
}

export default Currency;