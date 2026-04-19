import React, { useState } from "react";
// @ts-expect-error
import { useForm } from "react-hook-form";
import {
  Droplets, Plus, History, ChevronLeft, Trash2, Clock, GlassWater, CupSoda, Pencil,
  Settings,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { goalsSchema, type GoalsFormData } from "../../schemas/Goals";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";
import { useSettingsStore } from "../../store/settingsStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import AppLoadingScreen from "../../components/AppLoadingScreen";
import FeatureTutorialModal from "../../components/FeatureTutorialModal";
import { useAuthStore } from "../../store/authStore";
import CustomLoadingSpinner from "../../components/CustomLoadingSpinner";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const dateLocales = { en: enUS, br: ptBR, es };

const WaterGoal: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, lang } = useSettingsStore();
  const { user, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"today" | "week" | "month">("today");
  const [showTutorial, setShowTutorial] = useState(!user?.preferences.tutorialState?.water);

  const { register, handleSubmit, reset } = useForm<GoalsFormData>({
    resolver: zodResolver(goalsSchema),
    defaultValues: { customAmount: "" },
  });

  const { data: todayData, isLoading: loadingToday } = useQuery({
    queryKey: ["water-today"],
    queryFn: async () => {
      const res = await api.get("/water/today");
      return res.data;
    },
    refetchInterval: 60000,
  });

  const { data: historyData, isPending: loadingHistory } = useQuery({
    queryKey: ["water-history", activeTab],
    queryFn: async () => {
      const res = await api.get("/water/history", {
        params: activeTab === "month" ? { period: "month" } : undefined,
      });
      return res.data;
    },
    enabled: activeTab !== "today",
  });

  const logMutation = useMutation({
    mutationFn: (amount: number) => api.post("/water/log", { amount }),
    onMutate: async (amount: number) => {
      await queryClient.cancelQueries({ queryKey: ["water-today"] });
      const previousToday = queryClient.getQueryData<any>(["water-today"]);
      const optimisticLog = {
        id: `optimistic-${Date.now()}`,
        amount,
        date: new Date().toISOString(),
      };

      queryClient.setQueryData(["water-today"], (current: any) => ({
        ...(current || {}),
        total: Number(current?.total || 0) + amount,
        target: current?.target || user?.waterGoal || 3000,
        logs: [optimisticLog, ...(current?.logs || [])],
      }));

      return { previousToday };
    },
    onError: (_error, _amount, context) => {
      if (context?.previousToday) {
        queryClient.setQueryData(["water-today"], context.previousToday);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["water-today"] });
      queryClient.invalidateQueries({ queryKey: ["water-history"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/water/log/${id}`),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["water-today"] });
      const previousToday = queryClient.getQueryData<any>(["water-today"]);
      const deletedLog = previousToday?.logs?.find((log: any) => log.id === id);

      queryClient.setQueryData(["water-today"], (current: any) => ({
        ...(current || {}),
        total: Math.max(
          Number(current?.total || 0) - Number(deletedLog?.amount || 0),
          0,
        ),
        logs: (current?.logs || []).filter((log: any) => log.id !== id),
      }));

      return { previousToday };
    },
    onError: (_error, _id, context) => {
      if (context?.previousToday) {
        queryClient.setQueryData(["water-today"], context.previousToday);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["water-today"] });
    },
  });

  const currentWater = todayData?.total || 0;
  const targetWater = todayData?.target || 3000;
  const logs = todayData?.logs || [];
  const percentage = Math.min((currentWater / targetWater) * 100, 100);

  const addWater = (amount: number) => {
    logMutation.mutate(amount);
  };

  const handleCustomQtySubmit = (data: { customAmount: number }) => {
    addWater(Number(data.customAmount));
    reset();
  };

  const handleRemoveLog = (id: string) => {
    deleteMutation.mutate(id);
  };

  const closeTutorial = async (dontShowAgain: boolean) => {
    setShowTutorial(false);

    if (!dontShowAgain || !user?.id || user.preferences.tutorialState?.water) return;

    const { data } = await api.patch(`/users/${user.id}`, {
      tutorialState: {
        ...user.preferences.tutorialState,
        water: true,
      },
    });

    updateProfile(data);
  };

  if (loadingToday) {
    return (
      <AppLoadingScreen
        title={t("goals.water.loading_title")}
        subtitle={t("goals.water.loading_subtitle")}
      />
    );
  }

  return (
    <div className="text-neutral-900 lg:px-8 relative overflow-hidden">
      <div className="mx-auto flex lg:flex-row flex-col w-full gap-16">
        <div className="flex-1 flex flex-col justify-between">
          <header className="border border-neutral-200/50 flex sticky gap-4 items-center mb-8 bg-white/40 rounded-3xl p-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/50 rounded-xl transition-colors cursor-pointer hover:text-brand-accent"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="p-2 rounded-lg bg-brand-accent/10 text-brand-accent transition-colors">
              <GlassWater size={25} />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter text-brand-accent">
              {t("goals.water.title")}
            </h1>
            <aside className="ml-auto flex gap-2">
              <button onClick={() => navigate("/account", { state: { tab: "goals", section: "waterGoal" }, })} className="cursor-pointer md:h-12 md:w-12 w-9 h-9 border border-white hover:border-brand-accent hover:text-brand-accent text-zinc-400 rounded-2xl transition-colors">
                <Settings className="w-6 h-6 justify-self-center text-inherit mx-auto" />
              </button>
              <button onClick={() => setShowTutorial(true)} className="cursor-pointer md:h-12 md:w-12 w-9 h-9 border border-white hover:border-brand-accent hover:text-brand-accent text-zinc-400 rounded-2xl transition-colors">
                <Info className="w-6 h-6 justify-self-center text-inherit mx-auto" />
              </button>
            </aside>
          </header>
          <section className="border border-neutral-200/50 flex-1 flex flex-col justify-center items-center bg-white/40 rounded-3xl p-8 text-center">
            <div className="relative inline-flex items-center justify-center mb-6">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-blue-50" />
                <circle
                  cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={553}
                  strokeDashoffset={553 - (553 * percentage) / 100}
                  strokeLinecap="round"
                  className="text-brand-accent transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Droplets className="text-brand-accent mb-1" size={32} />
                <span className="text-3xl font-black">{currentWater}ml</span>
                <span className="text-neutral-400 text-sm font-medium">
                  {t("goals.water.goal")} {targetWater}ml
                </span>
              </div>
            </div>

            <p className="text-neutral-600 font-medium">
              {currentWater === 0 ? (
                <span className="text-brand-accent font-bold">{t("goals.water.start")}</span>
              ) : currentWater >= targetWater ? (
                <span className="text-emerald-500 font-bold uppercase tracking-widest">{t("goals.water.done")}</span>
              ) : (
                <>
                  {t("goals.water.remaining").split("?")[0]}{" "}
                  <span className="text-brand-accent">{Math.max(targetWater - currentWater, 0)}ml</span>{" "}
                  {t("goals.water.remaining").split("?")[1]}
                </>
              )}
            </p>
          </section>
        </div>

        <div className="flex-1 flex flex-col gap-8">
          <section className="justify-center grid lg:grid-rows-1 grid-rows-2 flex-col lg:grid-cols-4 grid-cols-3 gap-4">
            {[
              { label: "200ml", amount: 200, icon: GlassWater },
              { label: "500ml", amount: 500, icon: CupSoda },
              { label: "1L", amount: 1000, icon: Droplets },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => addWater(item.amount)}
                disabled={logMutation.isPending}
                className="bg-white/40 hover:bg-brand-accent border border-neutral-200 hover:text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer disabled:opacity-50"
              >
                <item.icon size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-[0.8rem] font-bold uppercase">{item.label}</span>
                <Plus size={16} />
              </button>
            ))}

            <form
              onSubmit={handleSubmit(handleCustomQtySubmit)}
              className="bg-white/40 border border-neutral-200 p-4 rounded-2xl lg:col-span-1 col-span-3 flex lg:flex-col lg:justify-center justify-evenly items-center gap-2 transition-all"
            >
              <Pencil size={20} />
              <div className="flex lg:text-[1rem] text-2xl">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="250"
                  className="w-20 lg:w-16 text-right outline-none bg-transparent mr-4"
                  {...register("customAmount", {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value.replace(/\D/g, "");
                      e.target.value = value.slice(0, 4);
                    }
                  })}
                />
                <span>ml</span>
              </div>
              <button type="submit" disabled={logMutation.isPending} className="bg-white lg:w-full lg:p-1 p-4 rounded-full flex items-center justify-center cursor-pointer hover:bg-brand-accent transition-colors hover:text-white">
                <Plus size={16} />
              </button>
            </form>
          </section>

          <section className="border border-neutral-200/50 overflow-hidden h-90 flex flex-col bg-white/40 rounded-3xl p-6 min-h-75 max-h-full">
            <div className="flex items-center gap-4 mb-6 shrink-0">
              <div className="p-2 rounded-2xl text-neutral-400">
                <History size={24} className="text-brand-accent" />
              </div>
              <div className="flex-1 flex p-1 bg-neutral-900/5 rounded-2xl gap-1">
                {(["today", "week", "month"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer ${activeTab === tab ? "bg-white text-brand-accent shadow-sm scale-[1.02]" : "text-neutral-400 hover:text-neutral-600 hover:bg-white/30"
                      }`}
                  >
                    {tab === "today" ? t("goals.water.today_history.title") : tab === "week" ? t("goals.water.week_history.title") : t("goals.water.month_history.title")}
                  </button>
                ))}
              </div>
            </div>

            <div className={`space-y-4 flex-1 overflow-y-auto pr-2 h-full ${activeTab === "month" ? "flex flex-col" : ""}`}>
              {activeTab === "today" && (
                <>
                  {logs.map((log: any) => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-white/30 rounded-2xl border border-white/20 transition-all hover:bg-white/40">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-brand-accent/10 text-brand-accent rounded-lg"><Droplets size={18} /></div>
                        <div>
                          <p className="font-bold text-sm">+{log.amount}ml</p>
                          <div className="flex items-center gap-1">
                            <Clock size={10} className="text-neutral-400" />
                            <p className="text-[10px] text-neutral-400 font-medium">
                              {capitalize(formatDistanceToNow(new Date(log.date), { addSuffix: true, locale: dateLocales[lang] }))}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer" onClick={() => handleRemoveLog(log.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-400 opacity-50 py-10">
                      <Droplets size={40} strokeWidth={1} /><p className="text-xs mt-2 font-medium">{t("goals.water.today_history.empty_state")}</p>
                    </div>
                  )}
                </>
              )}

              {activeTab === "week" && historyData && (
                <div className="space-y-3">
                  {historyData.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white/20 rounded-2xl border border-white/10 opacity-80 hover:opacity-100 transition-opacity">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-neutral-400 font-bold">
                          {new Date(`${item.id}T12:00:00`).toLocaleDateString(lang, {
                            weekday: "long",
                          })}
                        </span>
                        <span className="font-bold text-neutral-700">{item.amount}ml {t("goals.water.week_history.consumed")}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold text-neutral-400">{Math.round((item.amount / 3000) * 100)}%</span>
                        <div className="h-2 w-24 bg-neutral-900/5 rounded-full overflow-hidden border border-white/20">
                          <div className={`h-full transition-all duration-1000 ease-out rounded-full ${item.amount >= 3000 ? "bg-emerald-500" : "bg-brand-accent"}`} style={{ width: `${Math.min((item.amount / 3000) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "month" && historyData && (() => {
                const totalAmount = historyData.reduce((acc: number, item: any) => acc + item.amount, 0);
                const averageAmount = totalAmount / 30;
                const goalsMet = historyData.filter((item: any) => item.amount >= item.goal).length;

                return (
                  <div className="flex flex-col flex-1 h-full overflow-hidden">
                    <div className="flex justify-between items-end mb-4 shrink-0">
                      <div>
                        <p className="text-[9px] uppercase text-neutral-400 font-black tracking-widest leading-none mb-1">{t("goals.water.month_history.average")}</p>
                        <h4 className="text-lg font-black text-neutral-800 italic leading-none">{(averageAmount / 1000).toFixed(1)}L <span className="text-[10px] text-neutral-400">/ {t("goals.water.month_history.day")}</span></h4>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] uppercase text-emerald-500 font-black tracking-widest leading-none mb-1">{t("goals.water.month_history.beaten")}</p>
                        <h4 className="text-lg font-black text-emerald-500 italic leading-none">{goalsMet} <span className="text-[10px] text-neutral-400">/ 30</span></h4>
                      </div>
                    </div>
                    <div className="flex-1 min-h-0 relative flex flex-col justify-end bg-neutral-900/5 p-2 rounded-2xl border border-white/20">
                      <div className="flex items-end justify-between gap-px h-full w-full">
                        {historyData.map((item: any) => {
                          const perc = Math.min((item.amount / item.goal) * 100, 100);
                          return (
                            <div key={item.day} className="flex-1 h-full flex items-end group relative">
                              <div className={`w-full rounded-t-[1px] transition-all duration-700 ease-out ${item.amount >= item.goal ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.2)]" : "bg-brand-accent/40"}`} style={{ height: `${Math.max(perc, 4)}%` }} />
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 font-bold">{item.amount}ml</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 px-1 shrink-0">
                      <span className="text-[8px] font-black text-neutral-400 uppercase">D01</span>
                      <span className="text-[8px] font-black text-neutral-400 uppercase text-center opacity-50 italic">{t("goals.water.month_history.graph_title")}</span>
                      <span className="text-[8px] font-black text-neutral-400 uppercase">D30</span>
                    </div>
                  </div>
                );
              })()}

              {activeTab !== "today" && loadingHistory && (
                <div className="w-full h-full flex justify-center items-center">
                  <CustomLoadingSpinner />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {showTutorial && (
        <FeatureTutorialModal
          title={t("tutorials.water.title")}
          subtitle={t("tutorials.water.subtitle")}
          closeLabel={t("tutorials.close")}
          steps={[
            {
              title: t("tutorials.water.steps.quick_add.title"),
              description: t("tutorials.water.steps.quick_add.description"),
            },
            {
              title: t("tutorials.water.steps.custom.title"),
              description: t("tutorials.water.steps.custom.description"),
            },
            {
              title: t("tutorials.water.steps.history.title"),
              description: t("tutorials.water.steps.history.description"),
            },
            {
              title: t("tutorials.water.steps.goal.title"),
              description: t("tutorials.water.steps.goal.description"),
            },
          ]}
          dontShowAgainLabel={t("tutorials.do_not_show_again")}
          onContinue={closeTutorial}
        />
      )}
    </div>
  );
};

export default WaterGoal;



