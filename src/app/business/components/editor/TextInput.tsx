const TextInput = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
}) => {
  return (
    <input
      className="w-full rounded-[4px] bg-gray-100 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
};

export default TextInput;
