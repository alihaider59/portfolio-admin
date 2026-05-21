interface Props {
  name: string;
  className?: string;
}

export const ProjectImagePlaceholder = ({ name, className = "w-12 h-12" }: Props) => {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <div
      className={`${className} rounded-lg bg-[#25343F]/10 border-2 border-[#BFC9D1] flex items-center justify-center text-[#25343F] font-semibold text-xs sm:text-sm shrink-0`}
      aria-hidden
    >
      {initials}
    </div>
  );
};
