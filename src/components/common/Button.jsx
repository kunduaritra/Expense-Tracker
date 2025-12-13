import React from "react";

const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  type = "button",
  icon: Icon,
  className = "",
}) => {
  const baseStyles =
    "font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2";

  const variants = {
    primary:
      "gradient-primary text-white hover:opacity-90 shadow-lg shadow-purple-500/20",
    secondary:
      "bg-dark-card text-white hover:bg-opacity-80 border border-dark-border",
    ghost: "text-gray-300 hover:bg-dark-card",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
        ${className}
      `}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  );
};

export default Button;
