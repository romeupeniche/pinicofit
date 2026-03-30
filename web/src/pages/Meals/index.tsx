import React, { useState } from "react";
import { Plus, Utensils, Flame, Coffee, Sun, Moon, Star } from "lucide-react";
import MealGroup from "./MealGroup";
import SuggestionCard from "./SuggestionCard";
import MacroBar from "./MacroBar";
import AddModal from "./AddModal";
import { useIsMobile } from "../../hooks/useIsMobile";

// interface FoodItem {
//   id: string;
//   name: string;
//   kcal: number;
//   protein: number;
//   carbs: number;
//   fat: number;
//   source: "global" | "pinicodb" | "private";
//   unit?: string;
// }

// interface MealLog {
//   id: string;
//   type: "breakfast" | "lunch" | "snack" | "dinner";
//   items: FoodItem[];
//   timestamp: Date;
// }

const MealPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const isMobile = useIsMobile();

  const meta = {
    targetKcal: 1650,
    consumedKcal: 920,
    macros: {
      p: { current: 65, goal: 120 },
      c: { current: 110, goal: 160 },
      f: { current: 30, goal: 45 },
    },
  };

  return (
    <div className="min-h-screen p-4 pb-32">
      <section className="border border-white/5 rounded-[40px] p-6 mb-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              Restante para Emagrecer
            </p>
            <h1 className="text-5xl font-black tracking-tighter">
              {meta.targetKcal - meta.consumedKcal}
              <span className="text-brand-accent text-lg ml-2 font-bold">
                kcal
              </span>
            </h1>
          </div>
          <div className="h-16 w-16 rounded-3xl bg-brand-accent/10 border border-brand-accent/20 items-center justify-center flex">
            <Flame size={30} className="text-brand-accent" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MacroBar label="Prot" color="bg-blue-500" {...meta.macros.p} />
          <MacroBar label="Carb" color="bg-orange-500" {...meta.macros.c} />
          <MacroBar label="Gord" color="bg-red-500" {...meta.macros.f} />
        </div>
      </section>

      <div className="mb-6">
        <h2 className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-2">
          Sugestões do Dia
        </h2>
        <div
          className={`flex gap-4 overflow-x-auto pb-2 ${isMobile && "scrollbar-hide"}`}
        >
          <SuggestionCard
            title="Açaí do Pará"
            desc="5 colheres de açaí + leite ninho"
            kcal={320}
            icon={<Star size={18} />}
          />
          <SuggestionCard
            title="Almoço Fit"
            desc="1 xícara de arroz + frango"
            kcal={510}
            icon={<Utensils size={18} />}
          />
          <SuggestionCard
            title="Almoço Fit"
            desc="1 xícara de arroz + frango"
            kcal={510}
            icon={<Utensils size={18} />}
          />
          <SuggestionCard
            title="Almoço Fit"
            desc="1 xícara de arroz + frango"
            kcal={510}
            icon={<Utensils size={18} />}
          />
          <SuggestionCard
            title="Almoço Fit"
            desc="1 xícara de arroz + frango"
            kcal={510}
            icon={<Utensils size={18} />}
          />
          <SuggestionCard
            title="Almoço Fit"
            desc="1 xícara de arroz + frango"
            kcal={510}
            icon={<Utensils size={18} />}
          />
          <SuggestionCard
            title="Almoço Fit"
            desc="1 xícara de arroz + frango"
            kcal={510}
            icon={<Utensils size={18} />}
          />
          <SuggestionCard
            title="Almoço Fit"
            desc="1 xícara de arroz + frango"
            kcal={510}
            icon={<Utensils size={18} />}
          />
          <SuggestionCard
            title="Almoço Fit"
            desc="1 xícara de arroz + frango"
            kcal={510}
            icon={<Utensils size={18} />}
          />
          <SuggestionCard
            title="Almoço Fit"
            desc="1 xícara de arroz + frango"
            kcal={510}
            icon={<Utensils size={18} />}
          />
          <SuggestionCard
            title="Almoço Fit"
            desc="1 xícara de arroz + frango"
            kcal={510}
            icon={<Utensils size={18} />}
          />
          <SuggestionCard
            title="Almoço Fit"
            desc="1 xícara de arroz + frango"
            kcal={510}
            icon={<Utensils size={18} />}
          />
        </div>
      </div>

      <div className="space-y-3">
        <MealGroup
          title="Café da Manhã"
          icon={<Coffee size={18} />}
          kcal={280}
          items="Pão com ovo"
        />
        <MealGroup
          title="Almoço"
          icon={<Sun size={18} />}
          kcal={640}
          items="Arroz, feijão e filhote"
        />
        <MealGroup
          title="Lanche da Tarde"
          icon={<Utensils size={18} />}
          items=""
          kcal={0}
          isNext
        />
        <MealGroup title="Jantar" icon={<Moon size={18} />} kcal={0} items="" />
      </div>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed cursor-pointer bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-brand-accent rounded-full shadow-[0_0_50px_rgba(170,59,255,0.4)] items-center justify-center flex transition-transform active:scale-90 z-50"
      >
        <Plus size={36} className="text-black" strokeWidth={3} />
      </button>

      {isAddModalOpen && <AddModal onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
};

export default MealPage;
