import { FaSun, FaMoon } from 'react-icons/fa';

import { useTheme } from '../../hooks/useTheme';

export default function ThemeToggle({ className = '' }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className={`fixed bottom-24 right-4 md:right-6 p-3 md:p-4 rounded-full shadow-lg
                      ${isDark ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-blue-600 text-white hover:bg-blue-700'}
                      transform hover:scale-110 active:scale-95 transition-all duration-300 z-40
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
                      ${className}`}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            {isDark ? (
                <FaSun size={20} className="md:w-6 md:h-6 transition-transform hover:rotate-45 duration-300" />
            ) : (
                <FaMoon size={20} className="md:w-6 md:h-6 transition-transform hover:-rotate-12 duration-300" />
            )}
        </button>
    );
}