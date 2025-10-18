import React from "react";

interface ButtonProps {
  text: string;
  size?: "S" | "M" | "L";
  color?: "primary" | "secondary";
  rounded?: string;
  onClick?: () => void;
  className?: string;
}

function Button({
  text,
  size = "M",
  color = "primary",
  rounded = "",
  onClick,
  className = "",
}: ButtonProps) {
  const sizeClasses = {
    S: "ds-caption px-3 py-[6px]",
    M: "ds-text px-4 py-[8px]",
    L: "ds-text px-5 py-[10px]",
  };

  const variantClasses = {
    primary:
      "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
    secondary:
      "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 active:bg-gray-200",
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full 
        font-medium 
        transition 
        cursor-pointer 
        rounded-[8px]
        ${sizeClasses[size]} 
        ${variantClasses[color]} 
        ${rounded} 
        ${className}
      `}
    >
      {text}
    </button>
  );
}

export default Button;
