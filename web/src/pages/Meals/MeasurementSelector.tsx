import React, { useState } from "react";
import {
  Box,
  Boxes,
  Check,
  Coffee,
  Container,
  Droplets,
  GlassWater,
  Hand,
  Milk,
  Minus,
  Pipette,
  Plus,
  Scale,
  Soup,
  Target,
  TriangleAlert,
  UtensilsCrossed,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import type { BackendFood } from "../../types/food";
import { useAuthStore } from "../../store/authStore";

export type AllowedMeasuresLabels =
  | "unit"
  | "cup"
  | "metric"
  | "tablespoon"
  | "teaspoon"
  | "ladle"
  | "glass"
  | "bottle"
  | "can"
  | "drop"
  | "pinch"
  | "package";

interface Measure {
  label: { br: string; en: string; es: string };
  icon: React.ReactNode;
}

const allMeasures: Record<AllowedMeasuresLabels, Measure> = {
  unit: { label: { br: "Unidade", en: "Unit", es: "Unidad" }, icon: <Boxes size={20} /> },
  cup: { label: { br: "Xicara", en: "Cup", es: "Taza" }, icon: <Coffee size={20} /> },
  metric: { label: { br: "Grama/ML", en: "Gram/ML", es: "Gramo/ML" }, icon: <Scale size={20} /> },
  tablespoon: { label: { br: "Colher de Sopa", en: "Tablespoon", es: "Cuchara" }, icon: <UtensilsCrossed size={20} /> },
  teaspoon: { label: { br: "Colher de Cha", en: "Teaspoon", es: "Cucharadita" }, icon: <UtensilsCrossed size={16} /> },
  ladle: { label: { br: "Concha", en: "Ladle", es: "Cucharon" }, icon: <Soup size={20} /> },
  glass: { label: { br: "Copo", en: "Glass", es: "Vaso" }, icon: <GlassWater size={20} /> },
  bottle: { label: { br: "Garrafa", en: "Bottle", es: "Botella" }, icon: <Milk size={20} /> },
  can: { label: { br: "Lata", en: "Can", es: "Lata" }, icon: <Container size={20} /> },
  drop: { label: { br: "Gota", en: "Drop", es: "Gota" }, icon: <Pipette size={20} /> },
  pinch: { label: { br: "Pitada", en: "Pinch", es: "Pizca" }, icon: <Hand size={20} /> },
  package: { label: { br: "Pacote", en: "Package", es: "Paquete" }, icon: <Box size={20} /> },
};

interface Props {
  foodName: string;
  selectedItem: BackendFood;
  onConfirm: (data: {
    kcal: number;
    protein: number;
    carbs: number;
    fat: number;
    quantity: number;
    measure: string;
  }) => void;
  onClose: () => void;
}

const MeasurementSelector: React.FC<Props> = ({
  foodName,
  selectedItem,
  onConfirm,
  onClose,
}) => {
  const { lang } = useSettingsStore();
  const { user } = useAuthStore();
  const {
    allowedMeasures,
    kcal: kcalPer100g,
    protein: proteinPer100g,
    carbs: carbsPer100g,
    fat: fatPer100g,
    fiber: fiberPer100g,
    sodium: sodiumPer100g,
    sugar: sugarPer100g,
    brandName,
    useML,
  } = selectedItem;

  const allowedMeasuresKeys = Object.keys(
    allowedMeasures,
  ) as AllowedMeasuresLabels[];
  const [quantity, setQuantity] = useState<string>("1");
  const [selectedMeasure, setSelectedMeasure] = useState({
    label: allowedMeasuresKeys[0],
    weight: allowedMeasures[allowedMeasuresKeys[0]]!,
  });

  const safeQuantity = quantity === "" || quantity === "." ? 0 : Number(quantity);
  const qtyFactor = (safeQuantity * selectedMeasure.weight) / 100;

  const totals = {
    kcal: Math.round(kcalPer100g * qtyFactor),
    protein: (proteinPer100g * qtyFactor).toFixed(1),
    carbs: (carbsPer100g * qtyFactor).toFixed(1),
    fat: (fatPer100g * qtyFactor).toFixed(1),
    fiber: (fiberPer100g * qtyFactor).toFixed(1),
    sodium: Math.round(sodiumPer100g * qtyFactor),
    sugar: Number((sugarPer100g * qtyFactor).toFixed(1)),
  };

  const sugarGoal = user?.sugarGoal || 50;
  const sodiumGoal = user?.sodiumGoal || 2300;
  const sugarRatio = totals.sugar / sugarGoal;
  const sodiumRatio = totals.sodium / sodiumGoal;
  const hasSugarWarning = sugarRatio >= 0.3;
  const hasSodiumWarning = sodiumRatio >= 0.35;
  const MAX_QUANTITY = 999;

  const handleUpdateQty = (val: number) => {
    const nextValue = safeQuantity + val;
    if (nextValue >= 0 && nextValue <= MAX_QUANTITY) {
      setQuantity(nextValue.toString());
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-neutral-900 w-full max-w-4xl rounded-t-[40px] sm:rounded-[40px] border-t sm:border border-white/10 z-110 h-[95lvh] sm:h-auto max-h-[95lvh] flex flex-col overflow-hidden shadow-2xl">
        <div className="w-12 h-1.5 bg-neutral-800 rounded-full mx-auto my-4 shrink-0 sm:hidden" />

        <div className="flex-1 overflow-y-auto px-6 sm:px-10 pb-8">
          <div className="flex justify-between items-center py-6 sticky top-0 bg-neutral-900 z-10">
            <div className="flex-1 flex flex-col justify-center items-start">
              <h3 className="text-3xl font-black text-white leading-tight tracking-tight pr-4">
                {foodName}
              </h3>
              <span className="inline-block mt-2 bg-brand-accent/10 text-brand-accent px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-widest">
                {brandName || "Generico"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer bg-neutral-800 p-3 rounded-2xl text-neutral-400 hover:text-white hover:bg-red-500 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              <div className="bg-neutral-950 p-6 rounded-4xl border border-white/5">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-4 text-center">
                  Ajustar Quantidade
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleUpdateQty(-0.5)}
                    className="cursor-pointer w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center text-white border hover:bg-neutral-800 border-white/5 active:scale-90 transition-all disabled:opacity-30"
                    disabled={safeQuantity <= 0}
                  >
                    <Minus size={28} />
                  </button>

                  <input
                    type="text"
                    inputMode="decimal"
                    className="bg-transparent text-6xl font-black text-white text-center w-full outline-none tabular-nums"
                    value={quantity}
                    onChange={(event) => {
                      const val = event.target.value.replace(",", ".");
                      if (/^\d*\.?\d*$/.test(val) && Number(val) <= MAX_QUANTITY) {
                        setQuantity(val);
                      }
                    }}
                  />

                  <button
                    onClick={() => handleUpdateQty(0.5)}
                    className="cursor-pointer w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center text-white border hover:bg-neutral-800 border-white/5 active:scale-90 transition-all disabled:opacity-30"
                    disabled={safeQuantity >= MAX_QUANTITY}
                  >
                    <Plus size={28} />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-4 ml-2">
                  Escolha a Medida
                </p>
                <div className="space-y-2">
                  {allowedMeasuresKeys.map((measureKey) => {
                    const isActive = selectedMeasure.label === measureKey;

                    return (
                      <button
                        key={measureKey}
                        onClick={() => {
                          setSelectedMeasure({
                            label: measureKey,
                            weight: allowedMeasures[measureKey]!,
                          });
                          setQuantity(measureKey === "metric" ? "100" : "1");
                        }}
                        className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                          isActive
                            ? "bg-brand-accent border-brand-accent text-black"
                            : "bg-neutral-950 border-white/5 text-neutral-400"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={isActive ? "text-black" : "text-brand-accent"}>
                            {allMeasures[measureKey].icon}
                          </div>
                          <span className="text-sm font-black uppercase tracking-wider">
                            {measureKey === "metric"
                              ? allMeasures[measureKey].label[lang].split("/")[useML ? 1 : 0]
                              : allMeasures[measureKey].label[lang]}
                          </span>
                        </div>
                        {measureKey !== "metric" && (
                          <span
                            className={`text-xs font-bold ${
                              isActive ? "text-black/60" : "text-neutral-600"
                            }`}
                          >
                            {allowedMeasures[measureKey]}
                            {useML ? "ml" : "g"}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 sm:pb-0 pb-24">
              <div className="bg-neutral-950/50 rounded-4xl p-6 border border-white/5 h-full">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-6">
                  Informacao Nutricional
                </p>
                <div className="space-y-4">
                  <div className="flex items-end justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2 text-white">
                      <Zap size={20} className="text-brand-accent" />
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-black text-white tabular-nums">
                        {totals.kcal}
                      </span>
                      <span className="text-neutral-500 font-bold ml-1">kcal</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Proteinas", val: totals.protein, color: "bg-blue-500/10 text-blue-400", icon: <Target size={14} /> },
                      { label: "Carbos", val: totals.carbs, color: "bg-orange-500/10 text-orange-400", icon: <Zap size={14} /> },
                      { label: "Gorduras", val: totals.fat, color: "bg-yellow-500/10 text-yellow-400", icon: <Droplets size={14} /> },
                      { label: "Fibras", val: totals.fiber, color: "bg-emerald-500/10 text-emerald-400", icon: <Wind size={14} /> },
                    ].map((item) => (
                      <div key={item.label} className={`${item.color} p-4 rounded-2xl flex flex-col gap-1`}>
                        <div className="flex items-center gap-2 opacity-80">
                          {item.icon}
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-xl font-black tabular-nums">{item.val}g</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="bg-neutral-900 p-4 rounded-2xl border border-white/5">
                      <span className="block text-[8px] font-black text-neutral-600 uppercase mb-1">
                        Sodio
                      </span>
                      <span className="text-lg font-black text-red-400">{totals.sodium}mg</span>
                    </div>
                    <div className="bg-neutral-900 p-4 rounded-2xl border border-white/5">
                      <span className="block text-[8px] font-black text-neutral-600 uppercase mb-1">
                        Acucar
                      </span>
                      <span className="text-lg font-black text-amber-300">{totals.sugar}g</span>
                    </div>
                    <div className="bg-neutral-900 p-4 rounded-2xl border border-white/5 text-right">
                      <span className="block text-[8px] font-black text-neutral-600 uppercase mb-1">
                        Peso Total
                      </span>
                      <span className="text-lg font-black text-white">
                        {Math.round(safeQuantity * selectedMeasure.weight)}
                        {useML ? "ml" : "g"}
                      </span>
                    </div>
                  </div>

                  {(hasSugarWarning || hasSodiumWarning) && (
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-left">
                      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                        <TriangleAlert size={14} />
                        Fique atento
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-amber-100">
                        {hasSugarWarning && (
                          <p>
                            Esta porcao ja consome cerca de {Math.round(sugarRatio * 100)}% da sua meta diaria de acucar.
                          </p>
                        )}
                        {hasSodiumWarning && (
                          <p>
                            Esta porcao ja consome cerca de {Math.round(sodiumRatio * 100)}% da sua meta diaria de sodio.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    disabled={safeQuantity <= 0}
                    onClick={() =>
                      onConfirm({
                        kcal: totals.kcal,
                        protein: Number(totals.protein),
                        carbs: Number(totals.carbs),
                        fat: Number(totals.fat),
                        quantity: safeQuantity * selectedMeasure.weight,
                        measure: selectedMeasure.label,
                      })
                    }
                    className="w-full mt-8 bg-brand-accent disabled:bg-neutral-800 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
                  >
                    <Check size={20} className="text-black" strokeWidth={4} />
                    <span className="text-black font-black uppercase tracking-widest text-sm">
                      Adicionar
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sm:hidden absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-30">
          <button
            disabled={safeQuantity <= 0}
            onClick={() =>
              onConfirm({
                kcal: totals.kcal,
                protein: Number(totals.protein),
                carbs: Number(totals.carbs),
                fat: Number(totals.fat),
                quantity: safeQuantity * selectedMeasure.weight,
                measure: selectedMeasure.label,
              })
            }
            className="w-full bg-brand-accent hover:brightness-110 disabled:bg-neutral-800 disabled:text-neutral-600 py-6 rounded-[28px] flex items-center justify-center gap-4 active:scale-95 transition-all group"
          >
            <div className="bg-black/10 p-1.5 rounded-full">
              <Check size={20} className="text-black" strokeWidth={4} />
            </div>
            <span className="text-black font-black uppercase tracking-[0.25em] text-sm">
              Confirmar no Prato
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeasurementSelector;
