import React from "react";

interface ButtonProps {
  text: string;
  rounded?: string;
  onClick?: () => void;
  className?: string;
}

function Button({
  text,
  rounded = "rounded-full",
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-2 bg-primary-500 text-white font-medium ${rounded} hover:bg-primary-700 cursor-pointer ${className} `}
    >
      {text}
    </button>
  );
}

export default Button;
