import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import LJKAContextProvider from "./context/LJKAContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <LJKAContextProvider>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss
        draggable="touch"
        draggableDirection="x"
        limit={3}
        newestOnTop
      />
      <App />
    </LJKAContextProvider>
  </BrowserRouter>
);
