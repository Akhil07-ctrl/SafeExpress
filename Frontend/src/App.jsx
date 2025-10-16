import { ToastContainer } from "react-toastify";

import AppRoutes from "./routes/appRoutes";
import Chatbot from "./components/Chatbot";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function App() {
  return (
    <>
      <AppRoutes />

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
        theme="light"
      />

      <Chatbot />
    </>
  );
}

export default App;
