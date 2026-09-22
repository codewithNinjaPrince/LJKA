import { toast } from "react-toastify";

// Centralized toast styling so every page (Login, Register, etc.)
// shows errors/success/info in the exact same voice & format.

const baseOptions = {
  position: "bottom-center",
  hideProgressBar: false,
  theme: "dark",
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  draggable: "touch",
  draggableDirection: "x",
};

export const toastError = (message) =>
  toast.error(message || "Something went wrong. Please try again.", {
    ...baseOptions,
    icon: "⚠️",
  });

export const toastSuccess = (message) =>
  toast.success(message, {
    ...baseOptions,
    icon: "✅",
  });

export const toastInfo = (message) =>
  toast.info(message, {
    ...baseOptions,
    icon: "ℹ️",
  });
