import React from "react";
import { Plus, type LucideProps } from "lucide-react";

interface FoodResultItemProps {
  name: string;
  badge?: string;
  subtitle: string;
  onClick?: () => void;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  > | null;
  actions?: React.ReactNode;
  addLabel?: string;
}

const FoodResultItem: React.FC<FoodResultItemProps> = ({
  name,
  badge,
  subtitle,
  onClick,
  icon: Icon,
  actions,
  addLabel,
}) => (
  <div className="bg-neutral-950 p-4 rounded-3xl border border-white/5 flex items-center justify-between hover:bg-neutral-900 transition-colors gap-3">
    <div className="flex gap-4 items-center flex-1 min-w-0">
      {Icon ? <Icon className="text-brand-accent shrink-0" /> : null}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-white font-bold truncate">{name}</p>
          {badge ? (
            <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-[8px] text-neutral-500 font-bold uppercase shrink-0">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="text-neutral-500 text-[10px] mt-1 truncate">{subtitle}</p>
      </div>
    </div>

    <div className="flex items-center gap-2 shrink-0">
      {actions}
      {onClick ? (
        <button
          onClick={onClick}
          aria-label={addLabel}
          className="w-10 h-10 bg-neutral-800 cursor-pointer rounded-2xl items-center justify-center flex hover:bg-brand-accent hover:text-white transition-all shrink-0"
        >
          <Plus size={20} />
        </button>
      ) : null}
    </div>
  </div>
);

export default FoodResultItem;
