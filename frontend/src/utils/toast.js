import { toast } from "react-toastify";

// Centralized toast styling so every page (Login, Register, etc.)
// shows errors/success/info in the exact same voice & format.

const baseOptions = {
  position: "top-center",
  hideProgressBar: true,
  theme: "dark",
};

export const toastError = (message) =>
  toast.error(message || "Something went wrong. Please try again.", {
    ...baseOptions,
    autoClose: 3200,
    icon: "⚠️",
  });

export const toastSuccess = (message) =>
  toast.success(message, {
    ...baseOptions,
    autoClose: 2500,
    icon: "✅",
  });

export const toastInfo = (message) =>
  toast.info(message, {
    ...baseOptions,
    autoClose: 2800,
    icon: "ℹ️",
  });