import { useEffect } from 'react';

import { useTheme } from './useTheme';

export function useSystemTheme() {
    const { setIsDarkMode } = useTheme();

    useEffect(() => {
        // Watch for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            const systemPrefersDark = e.matches;
            const userPreference = localStorage.getItem('darkMode');

            // Only update if user hasn't set a preference
            if (userPreference === null) {
                setIsDarkMode(systemPrefersDark);
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [setIsDarkMode]);
}