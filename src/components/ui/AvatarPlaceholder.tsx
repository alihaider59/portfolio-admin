interface Props {
  name: string;
  className?: string;
}

export const AvatarPlaceholder = ({ name, className = "" }: Props) => {
  const initial = name
    .trim()
    .split(/\s+/)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[#17153B]/20 text-[#17153B] font-semibold text-sm shrink-0 ${className}`}
      title={name}
    >
      {initial}
    </div>
  );
};
