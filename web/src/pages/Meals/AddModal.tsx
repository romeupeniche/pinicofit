import React, { useEffect, useRef, useState } from "react";
import { Globe, Plus, Search, X, BookOpen, User, TableProperties } from "lucide-react";
import FoodResultItem from "./FoodResultItem";
import SourceFilter from "./SourceFilter";
import MeasurementSelector from "./MeasurementSelector";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useSettingsStore } from "../../store/settingsStore";
import { useAuthStore } from "../../store/authStore";
import type { BackendFood } from "../../types/food";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

interface AddModalProps {
  onClose: () => void;
}

const foodFonts: Record<string, { name: string; icon: any }> = {
  TACO: { name: "TACO", icon: TableProperties },
  PINICODB: { name: "PinicoDB", icon: BookOpen },
  USER: { name: "Meus Itens", icon: User },
};

const SEARCH_BATCH_SIZE = 120;

const normalizeSearchValue = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/,/g, " ")
    .toLowerCase()
    .trim();

const getFoodSearchNames = (food: BackendFood, lang: string) => {
  const localizedKey = `${lang}Name` as keyof BackendFood;
  const localizedName = (food[localizedKey] as string) || food.brName;

  return [
    localizedName,
    food.brName,
    food.enName,
    food.esName,
    food.brandName || "",
  ]
    .filter(Boolean)
    .map(normalizeSearchValue);
};

const getFoodSearchRank = (food: BackendFood, term: string, lang: string) => {
  const searchableNames = getFoodSearchNames(food, lang);

  if (searchableNames.some((name) => name === term)) return 0;
  if (searchableNames.some((name) => name.startsWith(term))) return 1;
  if (searchableNames.some((name) => name.split(/\s+/).includes(term))) return 2;
  if (searchableNames.some((name) => name.includes(term))) return 3;

  return 4;
};

const AddModal: React.FC<AddModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("global");
  const [activeType, setActiveType] = useState("food");
  const [isTyping, setIsTyping] = useState(false);
  const { lang } = useSettingsStore();
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [items, setItems] = useState<BackendFood[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedItem, setSelectedItem] = useState<BackendFood | null>(null);
  const [showMeasurementSelector, setShowMeasurementSelector] = useState(false);
  const ITEMS_PER_PAGE = 30;
  const isFetching = useRef(false);
  const lastFetchedPage = useRef(-1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const todayKey = new Date().toISOString().slice(0, 10);

  const logFoodMutation = useMutation({
    mutationFn: async (payload: {
      foodId: string;
      quantity: number;
      measure: string;
      kcal: number;
      protein: number;
      carbs: number;
      fat: number;
    }) => {
      const { data } = await api.post("/meals/log", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals-log", todayKey] });
    },
  });

  useEffect(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    lastFetchedPage.current = -1;
    isFetching.current = false;
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }, [searchTerm, currentTab, activeType]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchItems = async () => {
      if (isFetching.current || !token) return;
      if (page === lastFetchedPage.current && page !== 0) return;
      if (searchTerm.length > 0 && searchTerm.length < 2) {
        setItems([]);
        return;
      }

      setLoading(true);
      setIsTyping(false);
      isFetching.current = true;

      try {
        const endpoint = activeType === "food" ? "foods" : "meals";
        const isSearchMode = Boolean(searchTerm.trim());
        const url = new URL(`http://localhost:3000/${endpoint}`);
        url.searchParams.append(
          "skip",
          isSearchMode ? "0" : (page * ITEMS_PER_PAGE).toString(),
        );
        url.searchParams.append(
          "take",
          isSearchMode ? SEARCH_BATCH_SIZE.toString() : ITEMS_PER_PAGE.toString(),
        );
        if (searchTerm) url.searchParams.append("search", searchTerm.trim());
        if (currentTab !== "global") url.searchParams.append("source", currentTab);

        const response = await fetch(url.toString(), {
          signal: controller.signal,
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        });

        if (response.status === 401) {
          setHasMore(false);
          return;
        }

        const newData = await response.json();
        let dataArray = Array.isArray(newData) ? newData : [];

        if (searchTerm.trim()) {
          const term = normalizeSearchValue(searchTerm);

          dataArray = dataArray.sort((a, b) => {
            const rankA = getFoodSearchRank(a, term, lang);
            const rankB = getFoodSearchRank(b, term, lang);

            if (rankA !== rankB) return rankA - rankB;

            const primaryNameA = getFoodSearchNames(a, lang)[0] || "";
            const primaryNameB = getFoodSearchNames(b, lang)[0] || "";
            return primaryNameA.localeCompare(primaryNameB);
          });
        }

        setItems((prev) =>
          page === 0 || isSearchMode ? dataArray : [...prev, ...dataArray],
        );
        setHasMore(
          isSearchMode
            ? dataArray.length === SEARCH_BATCH_SIZE
            : dataArray.length === ITEMS_PER_PAGE,
        );
        lastFetchedPage.current = page;
      } catch (err: any) {
        if (err.name !== "AbortError") console.error("Fetch error:", err);
        setIsTyping(false);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    };

    const timeoutId = setTimeout(fetchItems, searchTerm ? 400 : 0);
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [page, searchTerm, currentTab, activeType, token]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 150;

    if (isAtBottom && !loading && !isFetching.current && hasMore) {
      setLoading(true);
      setPage(prev => prev + 1);
    }
  };

  const getFoodName = (food: BackendFood) => {
    const key = `${lang}Name` as keyof BackendFood;
    return (food[key] as string) || food.brName;
  };

  const handleShowSelector = (item: BackendFood) => {
    if (activeType === "food") {
      setSelectedItem(item);
      setShowMeasurementSelector(true);
    } else {
      onClose();
    }
  };

  const handleChangeTab = (tab: string) => {
    if (tab === currentTab) return;
    setLoading(true);
    setItems([]);
    setCurrentTab(tab);
  }

  const handleCreateFood = () => {
    console.log(page, items.length)
  }

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center">
      <div className="absolute w-full inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="bg-neutral-900 w-full max-w-xl rounded-t-[40px] px-8 pt-6 border-t border-white/10 z-70 h-[90lvh] flex flex-col">
        <div className="w-12 h-1.5 bg-neutral-800 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white leading-none">Add</h2>

          <div className="flex bg-neutral-950 p-1 rounded-2xl border border-white/5 relative w-44">
            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-accent rounded-xl transition-all duration-300 ${activeType === "food" ? "left-1" : "left-[calc(50%)]"}`} />
            {["food", "meal"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex-1 py-2 z-10 text-[10px] font-black uppercase tracking-widest transition-colors ${activeType === type ? "text-black" : "text-neutral-500 cursor-pointer"}`}
              >
                {type === "food" ? "Alimento" : "Refeição"}
              </button>
            ))}
          </div>

          <button onClick={onClose} className="cursor-pointer bg-neutral-800 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 h-full my-auto text-neutral-500" size={20} />
          <input
            className="w-full bg-neutral-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-medium focus:border-brand-accent/50 outline-none"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsTyping(true);
            }}
          />
        </div>

        <div className={`flex gap-2 mb-6 overflow-x-auto pb-2 ${isMobile && "scrollbar-hide"}`}>
          <SourceFilter icon={<Globe size={14} />} label="Global" onClick={() => handleChangeTab("global")} active={currentTab === "global"} />
          {Object.keys(foodFonts).map((tab) => {
            const Icon = foodFonts[tab].icon;
            return (
              <SourceFilter key={tab} icon={<Icon size={14} />} label={foodFonts[tab].name} onClick={() => handleChangeTab(tab)} active={tab === currentTab} />
            );
          })}
          <button onClick={handleCreateFood} className="cursor-pointer bg-brand-accent/40 hover:bg-brand-accent transition-colors rounded-full w-8 h-8 shrink-0 flex items-center justify-center">
            <Plus size={24} className="text-white" />
          </button>
        </div>

        <div ref={scrollContainerRef} onScroll={handleScroll} className="space-y-3 mb-2 overflow-y-auto flex-1 pr-1">
          {items.map((food, index) => (
            <FoodResultItem
              key={`${food.id}-${index}`}
              name={getFoodName(food)}
              font={food.brandName || ""}
              kcal={food.kcal}
              protein={food.protein}
              description={null}
              onClick={() => handleShowSelector(food)}
              icon={currentTab === "global" ? foodFonts[food.source].icon : null}
            />
          ))}

          {loading && (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-2 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
            </div>
          )}

          {!hasMore && items.length > 30 && (
            <div className="text-center text-[10px] text-neutral-600 font-bold uppercase tracking-widest py-8">Fim dos resultados</div>
          )}
          {!loading && !isTyping && items.length === 0 && searchTerm.length >= 2 && (
            <div className="text-center text-[10px] text-neutral-600 font-bold uppercase tracking-widest py-8">Nenhum item encontrado.</div>
          )}
        </div>
      </div>

      {showMeasurementSelector && selectedItem && (
        <MeasurementSelector
          foodName={getFoodName(selectedItem)}
          selectedItem={selectedItem}
          onConfirm={(data) => {
            logFoodMutation.mutate({
              foodId: selectedItem.id,
              quantity: data.quantity,
              measure: data.measure,
              kcal: data.kcal,
              protein: data.protein,
              carbs: data.carbs,
              fat: data.fat,
            });
            setShowMeasurementSelector(false);
            onClose();
          }}
          onClose={() => setShowMeasurementSelector(false)}
        />
      )}
    </div>
  );
};

export default AddModal;
