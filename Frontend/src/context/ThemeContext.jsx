import { createContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => { }
});

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Safe wrapper for browser APIs
const getInitialTheme = () => {
    if (!isBrowser) return 'light';

    try {
        // Check local storage first
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
            return savedTheme;
        }

        // Then check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
    } catch (error) {
        console.warn('Error accessing theme preferences:', error);
    }

    return 'light';
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme);

    // Handle system theme changes
    useEffect(() => {
        if (!isBrowser) return;

        try {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleChange = (e) => {
                // Only update if user hasn't manually set a preference
                if (!localStorage.getItem('theme')) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            };

            // Add listener for system theme changes
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } catch (error) {
            console.warn('Error setting up theme listener:', error);
        }
    }, []);

    // Update the DOM when theme changes
    useEffect(() => {
        if (!isBrowser) return;

        try {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(theme);
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.warn('Error updating theme:', error);
        }
    }, [theme]);

    const value = {
        theme,
        toggleTheme: () => {
            setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
        }
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export { ThemeContext };