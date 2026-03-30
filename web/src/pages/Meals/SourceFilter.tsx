import React from "react";

interface SourceFilterProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SourceFilter: React.FC<SourceFilterProps> = ({
  icon,
  label,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
      active
        ? "bg-brand-accent text-black border-brand-accent font-bold"
        : "bg-neutral-950 text-neutral-500 border-white/5 cursor-pointer hover:bg-neutral-900"
    }`}
  >
    {icon}
    <span className="text-[10px] uppercase font-black tracking-widest">
      {label}
    </span>
  </button>
);

export default SourceFilter;
