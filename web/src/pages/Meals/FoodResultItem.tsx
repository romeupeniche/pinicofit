import React from "react";
import { Plus } from "lucide-react";

interface FoodResultItemProps {
  name: string;
  font: string;
  kcal: number;
  protein: number;
  description: string | null;
  onClick: () => void;
}

const FoodResultItem: React.FC<FoodResultItemProps> = ({
  name,
  font,
  kcal,
  protein,
  description,
  onClick,
}) => (
  <div className="bg-neutral-950 p-4 rounded-3xl border border-white/5 flex items-center justify-between hover:bg-neutral-900 transition-colors">
    <div>
      <div className="flex items-center gap-2">
        <p className="text-white font-bold">{name}</p>
        {font && (
          <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-[8px] text-neutral-500 font-bold uppercase">
            {font}
          </span>
        )}
      </div>
      <p className="text-neutral-500 text-[10px] mt-1">
        {description ?? `${kcal} kcal • ${protein}g Prot / 100g`}
      </p>
    </div>
    <button
      onClick={onClick}
      className="w-10 h-10 bg-neutral-800 cursor-pointer rounded-2xl items-center justify-center flex hover:bg-brand-accent hover:text-white transition-all"
    >
      <Plus size={20} />
    </button>
  </div>
);

export default FoodResultItem;
