const ToolButton = ({
  onClick,
  active,
  label,
}: {
  onClick?: () => void;
  active?: boolean;
  label: React.ReactNode;
}) => {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-pressed={active}
      className={`cursor-pointer rounded-[4px] p-[2px] transition-colors ${
        active
          ? "bg-primary-50 text-primary-500"
          : "text-gray-700 hover:text-primary-500 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
};

export default ToolButton;
