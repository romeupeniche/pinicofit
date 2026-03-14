import React, { type ComponentProps } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  children: string;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "text-lg",
  ...props
}) => {
  return (
    <button
      className={` ${className} group relative cursor-pointer ${variant === "primary" ? "font-semibold" : "font-medium"} transition-colors duration-300 ${variant === "primary" ? "hover:text-brand-accent" : "hover:text-brand-pink"}`}
      {...props}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-1/2 w-0 h-0.5 ${variant === "primary" ? "bg-brand-accent" : "bg-brand-pink"} transition-all duration-300 group-hover:w-full group-hover:left-0`}
      ></span>
    </button>
  );
};

export default Button;
