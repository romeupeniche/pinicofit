import React from "react";

interface ButtonProps {
  children: string;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({ children, variant = "primary" }) => {
  return (
    <button
      className={`group relative cursor-pointer ${variant === "primary" ? "font-semibold" : "font-medium"} text-lg transition-colors duration-300 ${variant === "primary" ? "hover:text-brand-accent" : "hover:text-brand-pink"}`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-1/2 w-0 h-0.5 ${variant === "primary" ? "bg-brand-accent" : "bg-brand-pink"} transition-all duration-300 group-hover:w-full group-hover:left-0`}
      ></span>
    </button>
  );
};

export default Button;
