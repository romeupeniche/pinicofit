import type { LucideIcon } from "lucide-react";
import React from "react";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
  danger?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  active,
  onClick,
  danger,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active
          ? "bg-brand-accent text-white shadow-md shadow-brand-accent/20"
          : danger
            ? "text-red-500 hover:bg-red-50"
            : "text-neutral-600 hover:bg-white/50 hover:text-brand-accent"
      }`}
    >
      <Icon size={20} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
};

export default NavItem;
