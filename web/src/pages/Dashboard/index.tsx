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
import { useNavigate } from "react-router-dom";

const userStats = {
  caloriesMeta: 2200,
  caloriesConsumed: 1450,
  macros: {
    protein: { goal: 160, current: 110, color: "bg-brand-accent" },
    carbs: { goal: 250, current: 180, color: "bg-brand-pink" },
    fats: { goal: 70, current: 45, color: "bg-yellow-400" },
  },
};

const cardGoals: {
  id: string;
  titleId: TranslationKeys;
  icon: LucideIcon;
  progress: string;
  progressPercentage: number;
  remaining: string;
  postfix: string;
}[] = [
  {
    id: "water",
    titleId: "dashboard.cards.water",
    icon: GlassWater,
    progress: "1200ml",
    progressPercentage: 40,
    remaining: "1800",
    postfix: "ml",
  },
  {
    id: "workout",
    titleId: "dashboard.cards.workout",
    icon: Dumbbell,
    progress: "1/5",
    progressPercentage: 20,
    remaining: "4",
    postfix: "dashboard.cards.workout_postfix",
  },
  {
    id: "steps",
    titleId: "dashboard.cards.steps",
    icon: Footprints,
    progress: "200",
    progressPercentage: 75,
    remaining: "800",
    postfix: "dashboard.cards.steps_postfix",
  },
  {
    id: "sleep",
    titleId: "dashboard.cards.sleep",
    icon: BedDouble,
    progress: "8h",
    progressPercentage: 100,
    remaining: "0",
    postfix: "h",
  },
];

const Dashboard: React.FC = () => {
  const { t } = useSettingsStore();
  const navigate = useNavigate();
  const caloriesLeft = userStats.caloriesMeta - userStats.caloriesConsumed;
  const progressPercent =
    (userStats.caloriesConsumed / userStats.caloriesMeta) * 100;

  return (
    <div className="min-h-screen px-8 text-neutral-900 relative overflow-hidden">
      <header className="flex justify-between items-center md:items-end mb-12 flex-col md:flex-row gap-4 md:gap-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            {t("dashboard.title")}
          </h1>
          <p className="text-neutral-500 font-medium text-lg italic">
            "{t("dashboard.subtitle")}"
          </p>
        </div>
        <div className="flex gap-4">
          {cardGoals.map((card) => (
            <div
              key={card.id}
              className={`border ${card.progressPercentage === 100 ? "bg-green-100 border-green-300" : "bg-white/50 border-neutral-200"} p-3 rounded-2xl flex items-center gap-3`}
            >
              <card.icon
                className={`${card.progressPercentage === 100 ? "text-green-500" : "text-brand-accent"}`}
              />
              <div className="hidden lg:block">
                <p className="text-xs text-neutral-500 uppercase font-bold">
                  {t(card.titleId)}
                </p>
                <p className="font-semibold">{card.progress}</p>
              </div>
            </div>
          ))}
          <div className="bg-white/50 border border-neutral-200 p-3 rounded-2xl flex items-center gap-3">
            <Target className="text-brand-accent" />
            <div className="hidden lg:block">
              <p className="text-xs text-neutral-500 uppercase font-bold">
                {t("dashboard.meta_label")}
              </p>
              <p className="font-semibold">{userStats.caloriesMeta} kcal</p>
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white/40 border border-white/20 rounded-4xl p-8 shadow-xl flex flex-col md:flex-row md:gap-0 gap-4 items-center justify-around relative overflow-hidden">
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

          <button
            onClick={() => navigate("/meals")}
            className="mt-8 w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-brand-pink transition-colors cursor-pointer"
          >
            {t("dashboard.add_meal")}
          </button>
        </section>
      </main>

      <footer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {cardGoals.map(
          ({
            icon: Icon,
            id,
            titleId,
            progress,
            progressPercentage,
            remaining,
            postfix,
          }) => {
            return (
              <div
                key={id}
                className="bg-white/60 border border-neutral-200 p-6 rounded-3xl hover:border-brand-accent transition-all cursor-pointer group flex items-center justify-between"
                onClick={() => navigate(`/goals/${id}`)}
              >
                <div className="flex flex-col">
                  <div className="p-2 w-fit bg-neutral-100 rounded-lg group-hover:bg-brand-accent/10 group-hover:text-brand-accent transition-colors">
                    <Icon size={20} />
                  </div>

                  <div className="mt-4">
                    <h4 className="font-bold text-lg leading-tight">
                      {t(titleId)}
                    </h4>
                    <p className="text-neutral-500 text-xs mt-1">
                      {progressPercentage === 100 ? (
                        t("dashboard.cards.goal_reached")
                      ) : (
                        <>
                          {t("dashboard.cards.remaining")}
                          <span className="text-brand-accent font-bold">
                            {remaining}
                          </span>{" "}
                          {t(postfix as TranslationKeys)}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="relative flex items-center justify-center w-20 h-20">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 32 32"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      className="text-neutral-100"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray="88"
                      strokeDashoffset={88 - (88 * progressPercentage) / 100}
                      strokeLinecap="round"
                      className={`${progressPercentage === 100 ? "text-green-500" : "text-brand-accent"} transition-all duration-700`}
                    />
                  </svg>

                  <span
                    className={`absolute text-[10px] font-black ${progressPercentage === 100 ? "text-green-500" : "text-neutral-800"}`}
                  >
                    {progress}
                  </span>
                </div>
              </div>
            );
          },
        )}
      </footer>
    </div>
  );
};

export default Dashboard;
