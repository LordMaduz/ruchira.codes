import { useThemeStore } from "../store/themeStore";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useThemeStore();

  return (
    <footer className="pb-4 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto backdrop-blur-md border rounded-full px-4 sm:px-6 py-3 sm:py-4 shadow-2xl border-gray-200 dark:border-white/10" style={{
        background: theme === 'dark'
          ? 'linear-gradient(to bottom, rgba(39, 39, 42, 0.95), rgba(24, 24, 27, 0.95))'
          : 'rgba(255, 255, 255, 0.95)'
      }}>

        {/* Copyright Text - Centered */}
        <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          © {currentYear} Ruchira Rajapaksha. All Rights Reserved
        </div>

      </div>
    </footer>
  );
}