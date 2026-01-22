import React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const Toast = ({ type = "info", message , onClose } : { type?: string, message: string, onClose: () => void }) => {
  const getColors = () => {
    switch (type) {
      case "success":
        return {
          border: "border-l-4 border-green-500",
          bg: "bg-white/90",
          icon: "text-green-500",
          text: "text-gray-900",
        };
      case "error":
        return {
          border: "border-l-4 border-red-500",
          bg: "bg-white/90",
          icon: "text-red-500",
          text: "text-gray-900",
        };
      default:
        return {
          border: "border-l-4 border-blue-500",
          bg: "bg-white/90",
          icon: "text-blue-500",
          text: "text-gray-900",
        };
    }
  };

  const { border, bg, icon, text } = getColors();

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircleIcon className={`w-6 h-6 ${icon}`} />;
      case "error":
        return <XCircleIcon className={`w-6 h-6 ${icon}`} />;
      default:
        return <InformationCircleIcon className={`w-6 h-6 ${icon}`} />;
    }
  };

  return (
    <div
      className={`fixed top-5 right-5 flex items-center gap-4 px-5 py-3 shadow-xl ${bg} ${border} min-w-[300px] z-50 transform transition-all duration-300 animate-slide-in`}
      style={{ backdropFilter: "blur(6px)" }}
    >
      {/* Icon */}
      <div className="flex-shrink-0">{getIcon()}</div>

      {/* Message */}
      <div className={`flex-1 text-sm font-semibold ${text}`}>{message}</div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="ml-3 text-gray-500 hover:text-gray-700 font-bold text-lg transition"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
