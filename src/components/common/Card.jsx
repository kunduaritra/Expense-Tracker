import React from "react";

const Card = ({
  children,
  className = "",
  gradient = false,
  glass = false,
  onClick,
  hover = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl p-6
        ${gradient ? "gradient-card" : "bg-dark-card"}
        ${glass ? "glass-effect" : "border border-dark-border"}
        ${hover ? "hover:scale-105 cursor-pointer" : ""}
        ${onClick ? "cursor-pointer" : ""}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
