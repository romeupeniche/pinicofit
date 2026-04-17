import React from "react";
import { ChevronRight } from "lucide-react";

interface MealGroupProps {
  title: string;
  icon: React.ReactNode;
  kcal: number;
  items: string;
  pendingLabel?: string;
  isCurrentBucketBasedOnTime: boolean;
  isNext?: boolean;
  onClick?: () => void;
}

const MealGroup: React.FC<MealGroupProps> = ({
  title,
  icon,
  kcal,
  items,
  pendingLabel = "Pending",
  isCurrentBucketBasedOnTime,
  isNext,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`p-5 rounded-4xl border flex items-center transition-all ${(isCurrentBucketBasedOnTime && isNext)
      ? "bg-brand-accent/10 border-brand-accent/50"
      : isNext ? "bg-brand-accent/5 border-brand-accent/20"
        : "bg-neutral-900/5 border-white"
      } ${onClick ? "cursor-pointer hover:border-brand-accent/40" : ""}`}
  >
    <div
      className={`w-12 h-12 rounded-2xl items-center justify-center flex ${isNext ? "bg-brand-accent/20 text-brand-accent" : "bg-neutral-800 text-white"}`}
    >
      {icon}
    </div>
    <div className="ml-4 flex-1">
      <h4
        className={`text-sm font-bold ${isNext ? "text-brand-accent" : ""}`}
      >
        {title}
      </h4>
      <p className="text-xs text-neutral-600 line-clamp-1">
        {!isNext ? items : pendingLabel}
      </p>
    </div>
    <div className="text-right">
      <p
        className={`font-black text-xs ${kcal > 0 ? "text-brand-accent" : "text-neutral-800"}`}
      >
        {!isNext ? `${kcal} kcal` : "--"}
      </p>
      <ChevronRight size={14} className="ml-auto text-neutral-800 mt-1" />
    </div>
  </div>
);

export default MealGroup;
