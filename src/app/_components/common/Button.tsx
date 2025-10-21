interface ButtonProps {
  text: string;
  size?: 'S' | 'M' | 'L';
  color?: 'primary' | 'secondary' | string;
  rounded?: string;
  onClick?: () => void;
  className?: string;
}

function Button({
  text,
  size = 'M',
  color = 'primary',
  rounded = '',
  onClick,
  className = '',
}: ButtonProps) {
  const sizeClasses = {
    S: 'ds-caption px-3 py-[6px]',
    M: 'ds-text px-4 py-[8px]',
    L: 'ds-text px-5 py-[10px]',
  };

  const variantClasses: Record<string, string> = {
    primary:
      'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
    secondary:
      'bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 active:bg-gray-200',
  };

  const colorClasses = variantClasses[color] || color;

  return (
    <button
      onClick={onClick}
      className={`w-full cursor-pointer rounded-[8px] font-medium transition ${sizeClasses[size]} ${colorClasses} ${rounded} ${className} `}
    >
      {text}
    </button>
  );
}

export default Button;
