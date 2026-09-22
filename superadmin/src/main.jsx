import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
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
  </BrowserRouter>
);
