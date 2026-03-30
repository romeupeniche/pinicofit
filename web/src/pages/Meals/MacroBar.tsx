import React from "react";

interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  color: string;
}

const MacroBar: React.FC<MacroBarProps> = ({ label, current, goal, color }) => (
  <div className="p-3 rounded-2xl border border-white">
    <div className="flex justify-between items-end mb-2">
      <span className="text-[9px] font-black uppercase text-neutral-500">
        {label}
      </span>
      <span className="text-[10px] font-bold text-neutral-300">{current}g</span>
    </div>
    <div className="h-1 bg-neutral-950 rounded-full overflow-hidden">
      <div
        className={`${color} h-full`}
        style={{ width: `${(current / goal) * 100}%` }}
      />
    </div>
  </div>
);

export default MacroBar;
