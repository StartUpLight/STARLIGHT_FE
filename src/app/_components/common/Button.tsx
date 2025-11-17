import React from 'react';

interface ButtonProps {
  text: string;
  icon?: React.ReactNode; // ← 아이콘 추가
  size?: 'S' | 'M' | 'L';
  color?: 'primary' | 'secondary' | string;
  rounded?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

function Button({
  text,
  icon,
  size = 'M',
  color = 'primary',
  rounded = '',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const paddingClasses = {
    S: 'p-2',
    M: 'px-3 py-2',
    L: 'px-8 py-[10px]',
  };

  const defaultTextClasses = {
    S: 'ds-caption',
    M: 'ds-text',
    L: 'ds-text',
  };

  const variantClasses: Record<string, string> = {
    primary:
      'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
    secondary:
      'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 active:bg-gray-200',
    disabled:
      'bg-gray-200 text-gray-500 border border-gray-200 cursor-not-allowed ',
  };

  const colorClasses = disabled
    ? variantClasses.disabled
    : variantClasses[color] || color;

  const hasCustomTextClass =
    /ds-(caption|subtext|text|subtitle|title|heading)/.test(className);
  const textClass = hasCustomTextClass ? '' : defaultTextClasses[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center rounded-[8px] font-medium transition ${paddingClasses[size]} ${textClass} ${colorClasses} ${rounded} ${className} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} `}
    >
      <span>{text}</span>
      {icon && <span className="flex items-center">{icon}</span>}
    </button>
  );
}

export default Button;
