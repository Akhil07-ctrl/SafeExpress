import { ToastContainer } from "react-toastify";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { useTheme } from "./hooks/useTheme";
import AppRoutes from "./routes/appRoutes";
import Chatbot from "./components/Chatbot";
import ThemeToggle from "./components/common/ThemeToggle";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <AppRoutes />
      <ThemeToggle />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
      <Chatbot />
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
