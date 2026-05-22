interface Props {
  name: string;
  icon?: string | null;
  className?: string;
}

export const SkillIconPreview = ({ name, icon, className = "w-12 h-12" }: Props) => {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

  if (icon) {
    return (
      <img
        src={icon}
        alt={name}
        className={`${className} rounded-lg object-cover border-2 border-[#433D8B] shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${className} rounded-lg bg-[#17153B]/10 border-2 border-[#433D8B] flex items-center justify-center text-[#17153B] font-semibold text-xs sm:text-sm shrink-0`}
      aria-hidden
    >
      {initials}
    </div>
  );
};
