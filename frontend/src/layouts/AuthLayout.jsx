import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Logo from "../components/common/Logo";
import AuthIllustration from "../components/auth/AuthIllustration";
import AuthFeatureHighlights from "../components/auth/AuthFeatureHighlights";
import { Lock, ShieldCheck, BarChart2, Sun, Moon, Globe, ChevronDown, Check } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function AuthLayout() {
  const { theme, setTheme } = useTheme();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [currentLang, setCurrentLang] = useState(() => {
    try {
      return (
        sessionStorage.getItem("language") ||
        localStorage.getItem("expenseflow_language") ||
        "en"
      );
    } catch {
      return "en";
    }
  });

  const languages = [
    { code: "en", label: "English (en)" },
    { code: "hi", label: "Hindi (hi)" },
  ];

  const handleSelectLang = (code) => {
    setCurrentLang(code);
    try {
      sessionStorage.setItem("language", code);
      localStorage.setItem("expenseflow_language", code);
    } catch (e) {
      console.error(e);
    }
    setLangDropdownOpen(false);
  };

  const toggleTheme = () => {
    if (setTheme) {
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-[#F7F5EE] text-[#102A2A] selection:bg-[#104E42] selection:text-white">
      {/* Soft Pastel Background Decorative Elements */}
      <div
        className="pointer-events-none absolute -top-28 -left-28 h-[480px] w-[480px] rounded-full bg-[#E5EEE8] opacity-70 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-36 -left-20 h-[400px] w-[400px] rounded-full border-[36px] border-[#ECE5D4]/45 opacity-60"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-36 -right-36 h-[560px] w-[560px] rounded-full bg-[#F3E9DD]/65 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-16 right-20 h-[80px] w-[80px] rounded-full border-2 border-[#E7E2D2]/70 opacity-60 hidden sm:block"
        aria-hidden="true"
      />

      {/* 1. Header with Existing Logo & Top-Right Controls */}
      <header className="relative z-30 w-full max-w-[1450px] mx-auto px-6 sm:px-10 xl:px-[90px] pt-8 sm:pt-10 flex items-center justify-between shrink-0">
        {/* Brand: Logo & Wordmark & Tagline (Preserving LogoMark and typography) */}
        <div className="flex items-center">
          <Logo size="md" variant="dark" showTagline={true} />
        </div>

        {/* Top Right Controls: Theme Toggle & Language Selector */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E5D8] bg-[#FFFDF8] text-[#102A2A] hover:bg-[#F2EFE6] hover:border-[#DCD8CA] transition-all duration-150 cursor-pointer shadow-xs active:scale-95"
          >
            {theme === "dark" ? (
              <Moon size={18} className="text-[#087F68]" />
            ) : (
              <Sun size={18} className="text-[#D99016]" />
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex h-10 items-center gap-2 rounded-full border border-[#E8E5D8] bg-[#FFFDF8] px-3.5 sm:px-4 text-xs sm:text-[13px] font-semibold text-[#102A2A] hover:bg-[#F2EFE6] hover:border-[#DCD8CA] transition-all duration-150 cursor-pointer shadow-xs active:scale-95"
            >
              <Globe size={15} className="text-[#104E42]" />
              <span>{currentLang === "hi" ? "Hindi (hi)" : "English (en)"}</span>
              <ChevronDown
                size={14}
                className={`text-[#66736E] transition-transform duration-200 ${
                  langDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-[#E8E5D8] bg-[#FFFDF8] p-1.5 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-150">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLang(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-[13px] font-medium transition cursor-pointer ${
                      currentLang === lang.code
                        ? "bg-[#104E42] text-white font-semibold"
                        : "text-[#102A2A] hover:bg-[#F2EFE6]"
                    }`}
                  >
                    <span>{lang.label}</span>
                    {currentLang === lang.code && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Authentication Section: Proportional 3-Column Layout */}
      <main className="relative z-10 w-full max-w-[1450px] mx-auto px-6 sm:px-10 xl:px-12 py-8 sm:py-12 flex-1 flex items-center justify-center">
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-8 xl:gap-12">
          {/* Left Column: Finance Illustration (Target 380–440px on desktop, noticeably larger) */}
          <div className="hidden lg:flex items-center justify-center w-[380px] xl:w-[440px] shrink-0">
            <AuthIllustration />
          </div>

          {/* Center Column: Primary Authentication Card (540–560px on desktop, 40–48px real padding) */}
          <div className="w-full max-w-[550px] shrink-0 flex justify-center">
            <div className="auth-card border border-[#E8E5D8] bg-[#FFFDF8] shadow-[0_12px_45px_-8px_rgba(16,42,42,0.06),0_2px_8px_-2px_rgba(16,42,42,0.03)] transition-all">
              <Outlet />
            </div>
          </div>

          {/* Right Column: Feature Highlights (Target 300–320px on desktop, 28–36px item spacing) */}
          <div className="hidden lg:flex items-center justify-center w-[300px] xl:w-[320px] shrink-0">
            <AuthFeatureHighlights />
          </div>
        </div>
      </main>

      {/* 3. Bottom Centered Security Footer */}
      <footer className="relative z-20 w-full max-w-[1450px] mx-auto px-6 py-6 sm:py-8 flex flex-wrap items-center justify-center gap-4 sm:gap-7 text-xs sm:text-[13px] text-[#66736E] font-medium shrink-0">
        <div className="flex items-center gap-1.5">
          <Lock size={14} className="text-[#104E42]" />
          <span>Secure Connection</span>
        </div>
        <span className="h-3.5 w-px bg-[#E2DFD2] hidden sm:block" />
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={15} className="text-[#087F68]" />
          <span>JWT Protected Session</span>
        </div>
        <span className="h-3.5 w-px bg-[#E2DFD2] hidden sm:block" />
        <div className="flex items-center gap-1.5">
          <BarChart2 size={14} className="text-[#D99016]" />
          <span>Your Data, Always Safe</span>
        </div>
      </footer>
    </div>
  );
}

export default AuthLayout;