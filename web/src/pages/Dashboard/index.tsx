import React from "react";
import {
  Flame,
  Utensils,
  Target,
  TrendingUp,
  GlassWater,
  Footprints,
  Dumbbell,
  BedDouble,
  type LucideIcon,
} from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import type { TranslationKeys } from "../../types/i18n";

const userStats = {
  caloriesMeta: 2200,
  caloriesConsumed: 1450,
  macros: {
    protein: { goal: 160, current: 110, color: "bg-brand-accent" },
    carbs: { goal: 250, current: 180, color: "bg-brand-pink" },
    fats: { goal: 70, current: 45, color: "bg-yellow-400" },
  },
};

const cardGoals: { id: string; titleId: TranslationKeys; icon: LucideIcon }[] =
  [
    {
      id: "water",
      titleId: "dashboard.cards.water",
      icon: GlassWater,
    },
    {
      id: "workout",
      titleId: "dashboard.cards.workout",
      icon: Dumbbell,
    },
    {
      id: "steps",
      titleId: "dashboard.cards.steps",
      icon: Footprints,
    },
    {
      id: "sleep",
      titleId: "dashboard.cards.sleep",
      icon: BedDouble,
    },
  ];

const Dashboard: React.FC = () => {
  const { t } = useSettingsStore();
  const caloriesLeft = userStats.caloriesMeta - userStats.caloriesConsumed;
  const progressPercent =
    (userStats.caloriesConsumed / userStats.caloriesMeta) * 100;

  return (
    <div className="min-h-screen p-8 text-neutral-900 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-brand-accent/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-80 h-80 bg-brand-pink/20 rounded-full blur-[100px] -z-10"></div>

      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            {t("dashboard.title")}
          </h1>
          <p className="text-neutral-500 font-medium text-lg italic">
            "{t("dashboard.subtitle")}"
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/50 backdrop-blur-md border border-neutral-200 p-3 rounded-2xl flex items-center gap-3">
            <Target className="text-brand-accent" />
            <div>
              <p className="text-xs text-neutral-500 uppercase font-bold">
                {t("dashboard.meta_label")}
              </p>
              <p className="font-semibold">{userStats.caloriesMeta} kcal</p>
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white/40 backdrop-blur-xl border border-white/20 rounded-4xl p-8 shadow-xl flex items-center justify-around relative overflow-hidden">
          <div className="relative flex items-center justify-center">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-neutral-200/50"
              />
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={690}
                strokeDashoffset={690 - (690 * progressPercent) / 100}
                className="text-brand-accent transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black">{caloriesLeft}</span>
              <span className="text-neutral-500 uppercase text-xs font-bold tracking-widest">
                {t("dashboard.remaining")}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                <Flame />
              </div>
              <div>
                <p className="text-sm text-neutral-500">
                  {t("dashboard.consumed_label")}
                </p>
                <p className="text-2xl font-bold">
                  {userStats.caloriesConsumed} kcal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent/10 rounded-2xl text-brand-accent">
                <Utensils />
              </div>
              <div>
                <p className="text-sm text-neutral-500">
                  {t("dashboard.total_meals")}
                </p>
                <p className="text-2xl font-bold">4/6</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-neutral-900 text-white rounded-4xl p-8 shadow-2xl flex flex-col justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="text-brand-pink" size={20} />{" "}
            {t("dashboard.macros_title")}
          </h3>

          <div className="space-y-8 mt-6">
            {Object.entries(userStats.macros).map(([key, macro]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="capitalize font-medium text-neutral-400">
                    {key === "protein"
                      ? t("dashboard.macros.protein")
                      : key === "carbs"
                        ? t("dashboard.macros.carbs")
                        : t("dashboard.macros.fats")}
                  </span>
                  <span className="font-bold">
                    {macro.current}g{" "}
                    <span className="text-neutral-600 text-xs">
                      / {macro.goal}g
                    </span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${macro.color} transition-all duration-700`}
                    style={{ width: `${(macro.current / macro.goal) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-8 w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-brand-pink transition-colors cursor-pointer">
            {t("dashboard.add_meal")}
          </button>
        </section>
      </main>

      <footer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {cardGoals.map(({ icon: Icon, id, titleId }) => (
          <div
            key={id}
            className="bg-white/60 backdrop-blur-md border border-neutral-200 p-6 rounded-3xl hover:border-brand-accent transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div className="p-2 bg-neutral-100 rounded-lg group-hover:bg-brand-accent/10 group-hover:text-brand-accent transition-colors">
                <Icon size={20} />
              </div>
              <span className="text-xs font-bold text-green-500">+12%</span>
            </div>
            <h4 className="mt-4 font-bold text-lg">{t(titleId)}</h4>
            <p className="text-neutral-500 text-sm">
              {t("dashboard.cards.goal_reached")}
            </p>
          </div>
        ))}
      </footer>
    </div>
  );
};

export default Dashboard;
