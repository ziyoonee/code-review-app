"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="relative inline-flex h-11 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1 transition-all duration-300 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
        <span className="sr-only">Toggle theme</span>
        <div className="h-9 w-9 rounded-full bg-white shadow-lg" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="group relative inline-flex h-11 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1 transition-all duration-300 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 animate-gradient"
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      <div
        className={`absolute inset-1 flex h-9 w-9 transform items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 dark:bg-gray-900 ${
          theme === "dark" ? "translate-x-9" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? (
          <Moon className="h-5 w-5 text-purple-600 transition-all duration-300 group-hover:rotate-12" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-500 transition-all duration-300 group-hover:rotate-45" />
        )}
      </div>
      <div className="flex w-full justify-between px-3">
        <Sun className="h-4 w-4 text-white/60" />
        <Moon className="h-4 w-4 text-white/60" />
      </div>
    </button>
  );
}