interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: "w-10 h-10", text: "text-lg" },
  md: { icon: "w-14 h-14", text: "text-2xl" },
  lg: { icon: "w-20 h-20", text: "text-4xl" },
};

export default function Logo({ size = "md", showText = false }: LogoProps) {
  const s = sizeMap[size];
  return (
    <div className="flex items-center gap-3">
      <div className={`${s.icon} rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-cyan-200`}>
        <span className="text-white font-display text-xl" style={{ fontSize: size === "sm" ? "1rem" : size === "lg" ? "2rem" : "1.5rem" }}>
          拾
        </span>
      </div>
      {showText && (
        <h1 className={`${s.text} font-display text-gradient font-bold`}>
          拾光Campus
        </h1>
      )}
    </div>
  );
}