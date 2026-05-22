interface Props {
  companyName: string;
  icon?: string | null;
  iconBg?: string;
  /** Tailwind size utilities for width & height, e.g. w-12 h-12 */
  className?: string;
  /** rounded-full for circle, rounded-lg for square logo */
  variant?: "circle" | "rounded";
}

export const ExperienceIconPreview = ({
  companyName,
  icon,
  iconBg = "#17153B",
  className = "w-12 h-12",
  variant = "circle",
}: Props) => {
  const initials = companyName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";

  const radius = variant === "circle" ? "rounded-full" : "rounded-lg";
  const frameClass = `${className} ${radius} border-2 border-[#433D8B] shrink-0 overflow-hidden flex items-center justify-center`;

  if (icon) {
    return (
      <div className={frameClass} title={companyName}>
        <img
          src={icon}
          alt={companyName}
          className="w-full h-full min-w-full min-h-full object-cover object-center"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`${frameClass} text-white font-semibold text-xs sm:text-sm`}
      style={{ backgroundColor: iconBg }}
      aria-hidden
      title={companyName}
    >
      {initials}
    </div>
  );
};
