import React from "react";
import { X } from "lucide-react";

const BottomSheet = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl max-h-[90vh] overflow-hidden animate-slide-up"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: "1px solid var(--border-color)" }}
        >
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:opacity-70"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;
