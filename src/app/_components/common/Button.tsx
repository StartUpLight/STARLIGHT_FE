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
  };

  const colorClasses = variantClasses[color] || color;

  const hasCustomTextClass =
    /ds-(caption|subtext|text|subtitle|title|heading)/.test(className);
  const textClass = hasCustomTextClass ? '' : defaultTextClasses[size];

  return (
    <button
      onClick={onClick}
      className={`flex cursor-pointer items-center justify-center rounded-[8px] font-medium transition ${paddingClasses[size]} ${textClass} ${colorClasses} ${rounded} ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;
