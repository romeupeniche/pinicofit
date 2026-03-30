import React, {
  useMemo,
  useState,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import FoodResultItem from "./FoodResultItem";
import SourceFilter from "./SourceFilter";
import {
  BookOpen,
  Globe,
  Plus,
  Search,
  Star,
  User,
  X,
  type LucideProps,
} from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import MeasurementSelector from "./MeasurementSelector";

interface AddModalProps {
  onClose: () => void;
}

interface FontItem {
  id: string;
  name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

const foodFonts: Record<
  string,
  {
    name: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    items: (FontItem & {
      allowedMeasures: ("spoon" | "cup" | "unit" | "grams")[];
    })[];
  }
> = {
  pinico_db: {
    name: "PinicoDB",
    icon: BookOpen,
    items: [
      {
        id: "p1",
        name: "Açaí do Pará (Puro)",
        kcal: 60,
        protein: 0.8,
        carbs: 6.2,
        fat: 5.0,
        allowedMeasures: ["spoon", "cup", "grams"],
      },
      {
        id: "p2",
        name: "Filhote Grelhado",
        kcal: 140,
        protein: 24.0,
        carbs: 0.0,
        fat: 4.5,
        allowedMeasures: ["grams", "unit"],
      },
      {
        id: "p3",
        name: "Farinha d'Água",
        kcal: 360,
        protein: 1.5,
        carbs: 85.0,
        fat: 0.5,
        allowedMeasures: ["spoon", "cup", "grams"],
      },
    ],
  },
  api: {
    name: "Open Food Facts",
    icon: Globe,
    items: [
      {
        id: "g1",
        name: "Iogurte Natural",
        kcal: 74,
        protein: 4.1,
        carbs: 5.2,
        fat: 4.0,
        allowedMeasures: ["unit", "grams", "spoon"],
      },
      {
        id: "g2",
        name: "Pão de Forma Integral",
        kcal: 230,
        protein: 9.4,
        carbs: 42.0,
        fat: 2.8,
        allowedMeasures: ["unit", "grams"],
      },
    ],
  },
  private_user: {
    name: "Meus Itens",
    icon: User,
    items: [
      {
        id: "u1",
        name: "Whey Protein",
        kcal: 380,
        protein: 80.0,
        carbs: 5.0,
        fat: 4.0,
        allowedMeasures: ["grams", "spoon"],
      },
    ],
  },
  favorites: {
    name: "Salvos",
    icon: Star,
    items: [
      {
        id: "f1",
        name: "Banana Prata",
        kcal: 89,
        protein: 1.1,
        carbs: 23.0,
        fat: 0.3,
        allowedMeasures: ["unit", "grams"],
      },
    ],
  },
};

const mealFonts: Record<
  string,
  {
    name: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    items: (FontItem & {
      description: string;
      foods: { name: string; qty: number; unit: string }[];
    })[];
  }
> = {
  pinico_db: {
    name: "PinicoDB",
    icon: BookOpen,
    items: [
      {
        id: "m1",
        name: "Café da Manhã Padrão",
        description: "2 Ovos mexidos + 1 Pão integral",
        kcal: 320,
        protein: 18,
        carbs: 22,
        fat: 14,
        foods: [
          { name: "Ovo Mexido", qty: 2, unit: "unid" },
          { name: "Pão Integral", qty: 1, unit: "fatia" },
        ],
      },
      {
        id: "m2",
        name: "Almoço Equilibrado",
        description: "Frango, arroz, feijão e salada",
        kcal: 540,
        protein: 35,
        carbs: 65,
        fat: 12,
        foods: [
          { name: "Peito de Frango", qty: 120, unit: "g" },
          { name: "Arroz Branco", qty: 3, unit: "spoon" },
          { name: "Feijão Preto", qty: 1, unit: "concha" },
        ],
      },
    ],
  },
  private_user: {
    name: "Meus Itens",
    icon: User,
    items: [
      {
        id: "m3",
        name: "Meu Shake Pós-Treino",
        description: "Whey + Creatina + Banana",
        kcal: 280,
        protein: 26,
        carbs: 30,
        fat: 4,
        foods: [
          { name: "Whey Protein", qty: 30, unit: "g" },
          { name: "Banana Prata", qty: 1, unit: "unid" },
        ],
      },
    ],
  },
  favorites: {
    name: "Salvos",
    icon: Star,
    items: [
      {
        id: "m4",
        name: "Jantar Leve",
        description: "Omelete de claras com espinafre",
        kcal: 190,
        protein: 20,
        carbs: 5,
        fat: 8,
        foods: [{ name: "Omelete", qty: 1, unit: "unid" }],
      },
    ],
  },
};

const AddModal: React.FC<AddModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("global");
  const [activeType, setActiveType] = useState("food");
  const [selectedItem, setSelectedItem] = useState<
    (FontItem & { allowedMeasures?: string[] }) | null
  >(null);
  const [showMeasurementSelector, setShowMeasurementSelector] = useState(false);
  const isMobile = useIsMobile();

  const filteredItems = useMemo(() => {
    const currentSourceData = activeType === "food" ? foodFonts : mealFonts;
    let itemsToSearch = [];

    if (currentTab === "global") {
      itemsToSearch = Object.entries(currentSourceData).flatMap(([, source]) =>
        source.items.map((item: FontItem) => ({
          ...item,
          sourceName: source.name,
          itemType: activeType,
        })),
      );
    } else {
      const selectedSource =
        currentSourceData[currentTab as keyof typeof currentSourceData];
      itemsToSearch =
        selectedSource?.items.map((item) => ({
          ...item,
          sourceName: selectedSource.name,
          itemType: activeType,
        })) || [];
    }

    if (searchTerm.trim() !== "") {
      return itemsToSearch.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return itemsToSearch;
  }, [currentTab, searchTerm, activeType]);

  const handleAddFood = () => {
    console.log("adding food");
  };

  const availableTabs = Object.keys(foodFonts).filter((f) => f !== "api");

  const handleShowMeasumentSelector = (
    item: FontItem & { allowedMeasures?: string[] },
  ) => {
    if (activeType === "food") {
      setShowMeasurementSelector(true);
      setSelectedItem(item);
    } else {
      onClose();
    }
  };

  const handleOnConfirm = () => {
    setShowMeasurementSelector(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center">
      <div
        className="absolute w-full inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="bg-neutral-900 w-full max-w-xl rounded-t-[40px] px-8 pt-6 border-t border-white/10 z-70 h-[90lvh] flex flex-col">
        <div className="w-12 h-1.5 bg-neutral-800 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white leading-none">Add</h2>
          <div className="flex bg-neutral-950 p-1 rounded-2xl border border-white/5 relative w-44">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-accent rounded-xl transition-all duration-300 ${
                activeType === "food" ? "left-1" : "left-[calc(50%)]"
              }`}
            />

            {[
              { label: "Alimento", value: "food" },
              { label: "Refeição", value: "meal" },
            ].map((type) => (
              <button
                onClick={() => setActiveType(type.value)}
                className={`flex-1 py-2 z-10 transition-colors duration-300 items-center justify-center flex ${
                  activeType === type.value
                    ? "text-black"
                    : "text-neutral-500 cursor-pointer"
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="bg-neutral-800 p-2 rounded-full hover:text-white hover:bg-red-500 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="relative mb-6">
          <Search
            className="absolute left-4 h-full my-auto text-neutral-500"
            size={20}
          />
          <input
            className="w-full bg-neutral-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-medium focus:border-brand-accent/50 outline-none"
            placeholder="Buscar na Global, PinicoDB ou Meus Itens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div
          className={`flex gap-2 mb-6 overflow-x-auto pb-2 ${isMobile && "scrollbar-hide"}`}
        >
          <SourceFilter
            icon={<Globe size={14} />}
            label="Global"
            onClick={() => setCurrentTab("global")}
            active={currentTab === "global"}
          />
          {availableTabs.map((tab) => {
            const Icon = foodFonts[tab].icon;
            return (
              <SourceFilter
                icon={<Icon size={14} />}
                label={foodFonts[tab].name}
                onClick={() => setCurrentTab(tab)}
                active={tab === currentTab}
              />
            );
          })}
          <button
            onClick={handleAddFood}
            className="bg-brand-accent/40 hover:bg-brand-accent transition-colors cursor-pointer rounded-full w-8 h-8 shrink-0 flex items-center justify-center"
          >
            <Plus size={24} className="text-white" />
          </button>
        </div>

        <div className="space-y-3 mb-2 overflow-y-auto flex-1">
          {filteredItems.map(
            (
              food: FontItem & {
                sourceName?: string;
                description?: string;
                allowedMeasures?: string[];
              },
            ) => (
              <FoodResultItem
                key={food.id}
                name={food.name}
                font={currentTab === "global" ? food.sourceName! : ""}
                kcal={food.kcal}
                protein={food.protein}
                description={food.description ?? null}
                onClick={() =>
                  handleShowMeasumentSelector({
                    ...food,
                    allowedMeasures: food.allowedMeasures ?? [],
                  })
                }
              />
            ),
          )}
        </div>
      </div>
      {showMeasurementSelector && selectedItem && (
        <MeasurementSelector
          foodName={selectedItem.name}
          kcalPer100g={selectedItem.kcal}
          allowedMeasures={selectedItem.allowedMeasures}
          onConfirm={handleOnConfirm}
          onClose={() => setShowMeasurementSelector(false)}
        />
      )}
    </div>
  );
};

export default AddModal;
