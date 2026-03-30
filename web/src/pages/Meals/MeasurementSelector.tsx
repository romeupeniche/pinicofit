import React, { useState } from "react";
import {
  Check,
  X,
  Scale,
  Soup,
  Coffee,
  Calculator,
  Plus,
  Minus,
} from "lucide-react";

interface Measure {
  id: string;
  label: string;
  factor: number;
  icon: React.ReactNode;
}

interface Props {
  foodName: string;
  kcalPer100g: number;
  allowedMeasures?: string[];
  onConfirm: (kcal: number) => void;
  onClose: () => void;
}

const MeasurementSelector: React.FC<Props> = ({
  foodName,
  kcalPer100g,
  allowedMeasures = ["grams", "spoon", "cup", "unit"],
  onConfirm,
  onClose,
}) => {
  const allMeasures: Measure[] = [
    {
      id: "spoon",
      label: "Colher de Sopa",
      factor: 15,
      icon: <Soup size={18} />,
    },
    {
      id: "cup",
      label: "Xícara (chá)",
      factor: 200,
      icon: <Coffee size={18} />,
    },
    {
      id: "unit",
      label: "Unidade Média",
      factor: 100,
      icon: <Calculator size={18} />,
    },
    {
      id: "grams",
      label: "Gramas (Exato)",
      factor: 1,
      icon: <Scale size={18} />,
    },
  ];

  const availableMeasures = allMeasures.filter((m) =>
    allowedMeasures.includes(m.id),
  );

  const [quantity, setQuantity] = useState<string>("1");
  const [selectedMeasure, setSelectedMeasure] = useState<Measure>(
    availableMeasures[0],
  );

  const totalKcal = Math.round(
    (kcalPer100g / 100) * (Number(quantity) * selectedMeasure.factor),
  );

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="bg-neutral-900 w-full max-w-xl rounded-t-[40px] px-8 pt-6 border-t border-white/10 z-110 h-[90lvh] flex flex-col">
        <div className="w-12 h-1.5 bg-neutral-800 rounded-full mx-auto mb-6 shrink-0" />

        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-3xl font-black text-white leading-tight tracking-tighter">
              {foodName}
            </h3>
            <p className="text-neutral-500 text-xs font-black uppercase tracking-[0.2em] mt-1 italic">
              {selectedMeasure.label} selecionada
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-neutral-800 cursor-pointer p-3 rounded-full text-neutral-400 hover:text-red-500 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-neutral-950 rounded-4xl p-8 mb-8 items-center justify-center flex flex-col border border-brand-accent/20 shadow-inner">
          <div className="flex items-baseline gap-2">
            <span className="text-brand-accent font-black text-6xl tracking-tighter transition-all">
              {totalKcal}
            </span>
            <span className="text-brand-accent/60 font-bold text-lg">kcal</span>
          </div>
          <span className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            Total Estimado
          </span>
        </div>

        <div className="flex items-center justify-between mb-10 px-6">
          <button
            onClick={() =>
              setQuantity(Math.max(0.5, Number(quantity) - 0.5).toString())
            }
            className="w-16 h-16 cursor-pointer hover:text-brand-accent/60 bg-neutral-800 rounded-3xl items-center justify-center flex text-3xl font-bold active:scale-90 transition-all border border-white/5 shadow-lg"
          >
            <Minus />
          </button>
          <div className="items-center flex flex-col">
            <input
              className="text-5xl font-black text-white tabular-nums w-45 text-center"
              value={quantity}
              onChange={(e) => {
                let val = e.target.value;
                val = val.replace(",", ".");
                val = val.replace(/[^\d.]/g, "");
                const parts = val.split(".");
                if (parts.length > 2) {
                  val = parts[0] + "." + parts.slice(1).join("");
                }
                setQuantity(val);
              }}
            />
            <span className="text-neutral-500 text-xs font-black uppercase tracking-widest mt-1">
              Quantidade
            </span>
          </div>
          <button
            onClick={() => setQuantity((Number(quantity) + 0.5).toString())}
            className="w-16 h-16 cursor-pointer hover:text-brand-accent/60 bg-neutral-800 rounded-3xl items-center justify-center flex text-3xl font-bold active:scale-90 transition-all border border-white/5 shadow-lg"
          >
            <Plus />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          {allMeasures.map((m) => (
            <button
              key={m.id}
              disabled={!allowedMeasures.includes(m.id)}
              onClick={() => {
                if (!allowedMeasures.includes(m.id)) return;
                setSelectedMeasure(m);
                if (m.id === "gramas") setQuantity("100");
                else if (Number(quantity) > 20) setQuantity("1");
              }}
              className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all disabled:opacity-60 ${
                selectedMeasure.id === m.id
                  ? "bg-brand-accent/10 border-brand-accent text-brand-accent shadow-[0_0_20px_rgba(170,59,255,0.1)]"
                  : "bg-neutral-950 border-white/5 text-neutral-500 enabled:hover:border-white/10 enabled:cursor-pointer enabled:active:scale-95"
              }`}
            >
              <div
                className={
                  selectedMeasure.id === m.id
                    ? "text-brand-accent"
                    : "text-neutral-600"
                }
              >
                {m.icon}
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-left leading-none">
                {m.label}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => onConfirm(totalKcal)}
          className="w-full cursor-pointer bg-brand-accent py-4 rounded-4xl flex items-center justify-center gap-4 shadow-[0_15px_40px_rgba(170,59,255,0.3)] active:scale-95 transition-all group"
        >
          <Check
            size={24}
            className="text-black group-hover:scale-125 transition-transform"
            strokeWidth={3}
          />
          <span className="text-black font-black uppercase tracking-[0.25em] text-sm">
            Confirmar no Prato
          </span>
        </button>
      </div>
    </div>
  );
};

export default MeasurementSelector;
