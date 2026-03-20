import React, { useState } from "react";
import {
  Settings2,
  ChevronRight,
  Zap,
  Flame,
  Clock,
  ChevronLeft,
  Dumbbell,
  type LucideIcon,
} from "lucide-react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { ptBR, enUS, es } from "date-fns/locale";
import WorkoutList from "./WorkoutList";
import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "../../store/settingsStore";
import type { TranslationKeys } from "../../types/i18n";

const dateLocales = {
  en: enUS,
  br: ptBR,
  es,
};

interface IWorkout {
  id: string;
  group: string;
  category: string;
  name: string;
  weight: string;
  technique: string;
  sets: string;
  rest: string;
  obs: string;
}

const workoutsByDay: Record<string, IWorkout[]> = {
  "Perna (Foco Quadríceps)": [
    {
      id: "leg-01",
      group: "Perna",
      category: "Exercício",
      name: "Agachamento Búlgaro",
      weight: "40 lbs / 20 kg",
      technique: "standard",
      sets: "3",
      rest: "2:00",
      obs: "Focar no equilíbrio e descida lenta.",
    },
    {
      id: "leg-02",
      group: "Perna",
      category: "Exercício",
      name: "LegPress",
      weight: "125 lbs / 58 kg",
      technique: "standard",
      sets: "3",
      rest: "2:00",
      obs: "Manter amplitude total.",
    },
    {
      id: "leg-03",
      group: "Perna",
      category: "Exercício",
      name: "Cadeira Extensora",
      weight: "120 kg",
      technique: "Drop-set",
      sets: "3",
      rest: "1:00",
      obs: "Pausa no topo da contração.",
    },
    {
      id: "leg-04",
      group: "Perna",
      category: "Exercício",
      name: "Mesa Flexora",
      weight: "80 kg",
      technique: "Bi-set",
      sets: "2",
      rest: "-",
      obs: "Poucas reps, focar na cadência.",
    },
    {
      id: "leg-05",
      group: "Perna",
      category: "Exercício",
      name: "Gêmeos em Pé",
      weight: "45 lbs / 22 kg",
      technique: "Bi-set",
      sets: "1",
      rest: "2:00",
      obs: "Alongamento máximo embaixo.",
    },
  ],
  "Peito & Ombro": [
    {
      id: "ch-01",
      group: "Peito",
      category: "Aquecimento",
      name: "Manguito Rotador",
      weight: "5 lbs",
      technique: "standard",
      sets: "2",
      rest: "1:00",
      obs: "Aquecer bem os rotadores.",
    },
    {
      id: "ch-02",
      group: "Peito",
      category: "Exercício",
      name: "Supino Inclinado Máquina",
      weight: "70 lbs / 35 kg",
      technique: "standard",
      sets: "3",
      rest: "2:00",
      obs: "Focar na parte superior do peitoral. Banco no 8",
    },
    {
      id: "ch-03",
      group: "Peito",
      category: "Exercício",
      name: "Voador (Pec Deck)",
      weight: "80 lbs / 40 kg",
      technique: "standard",
      sets: "3",
      rest: "1:30",
      obs: "Não deixar os ombros subirem.",
    },
    {
      id: "sh-01",
      group: "Ombro",
      category: "Exercício",
      name: "Desenvolvimento Máquina",
      weight: "45 lbs",
      technique: "Bi-set",
      sets: "3",
      rest: "-",
      obs: "Explosão na subida.",
    },
    {
      id: "sh-02",
      group: "Ombro",
      category: "Exercício",
      name: "Elevação Lateral",
      weight: "15 kg",
      technique: "Bi-set",
      sets: "3",
      rest: "2:00",
      obs: "Até a falha total.",
    },
  ],
  "Costas & Bíceps": [
    {
      id: "bk-01",
      group: "Costas",
      category: "Exercício",
      name: "Pulley Frente",
      weight: "11 placas",
      technique: "standard",
      sets: "3",
      rest: "2:00",
      obs: "Barra W / Pegada aberta.",
    },
    {
      id: "bk-02",
      group: "Costas",
      category: "Exercício",
      name: "Remada Baixa",
      weight: "90 lbs",
      technique: "standard",
      sets: "3",
      rest: "2:00",
      obs: "Tronco estável.",
    },
    {
      id: "bi-01",
      group: "Bíceps",
      category: "Exercício",
      name: "Rosca Direta Polia",
      weight: "40 lbs",
      technique: "standard",
      sets: "3",
      rest: "1:30",
      obs: "Cotovelos colados no corpo.",
    },
  ],
};

const titles: Record<string, { title: TranslationKeys; icon: LucideIcon }> = {
  workout: {
    title: "goals.workout.workout_window.title",
    icon: Dumbbell,
  },
  plan: {
    title: "goals.workout.plan_window.title",
    icon: Settings2,
  },
};

const WorkoutGoal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("workout");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();
  const { t, lang } = useSettingsStore();

  const dayTimeline = [
    {
      label: t("goals.workout.workout_window.yesterday"),
      date: subDays(today, 1),
      workout: "Perna (Foco Quadríceps)",
    },
    {
      label: t("goals.workout.workout_window.today"),
      date: today,
      workout: "Peito & Ombro",
    },
    {
      label: t("goals.workout.workout_window.tomorrow"),
      date: addDays(today, 1),
      workout: "Costas & Bíceps",
    },
  ];

  const activeDayInfo = dayTimeline.find((d) =>
    isSameDay(d.date, selectedDate),
  );
  const currentExercises = workoutsByDay[activeDayInfo?.workout || ""] || [];

  const isPast = selectedDate < subDays(today, 0.5);

  const TitleIcon = titles[activeTab].icon;

  return (
    <section>
      <div className="mb-8">
        <header className="border border-neutral-200/50 flex md:flex-row flex-col justify-between md:items-center sticky gap-4 bg-white/40 rounded-3xl p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/50 rounded-xl transition-colors cursor-pointer hover:text-brand-accent"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="p-2 rounded-lg bg-brand-accent/10 text-brand-accent transition-colors">
              <TitleIcon size={25} />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter text-brand-accent">
              {t(titles[activeTab].title)}
            </h1>
          </div>
          <div className="flex p-1 rounded-2xl gap-2">
            {(["workout", "plan"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer ${
                  activeTab === tab
                    ? "bg-white text-brand-accent shadow-sm scale-[1.02]"
                    : "text-neutral-400 hover:text-neutral-600 hover:bg-white/30"
                }`}
              >
                {tab === "workout"
                  ? t("goals.workout.workout_window.badge_title")
                  : t("goals.workout.plan_window.badge_title")}
              </button>
            ))}
          </div>
        </header>
      </div>

      {activeTab === "workout" ? (
        <section className="space-y-8">
          <div className="flex gap-3">
            {dayTimeline.map((d) => {
              const isActive = isSameDay(d.date, selectedDate);
              return (
                <button
                  key={d.label}
                  onClick={() => setSelectedDate(d.date)}
                  className={`flex-1 p-4 rounded-4xl border transition-all text-left relative overflow-hidden ${isActive ? "border-brand-accent bg-brand-accent/4 ring-2 ring-brand-accent/10" : "border-neutral-100 bg-white hover:border-brand-accent/50 cursor-pointer"}`}
                >
                  <span
                    className={`block text-[9px] uppercase font-black mb-1 ${isActive ? "text-brand-accent" : "text-neutral-400"}`}
                  >
                    {d.label}
                  </span>
                  <span
                    className={`text-lg font-black ${isActive ? "text-neutral-900" : "text-neutral-700"}`}
                  >
                    {format(d.date, "dd MMM", { locale: dateLocales[lang] })}
                  </span>
                  <p className="text-[8px] font-bold text-neutral-400 mt-1 uppercase truncate leading-none">
                    {d.workout}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-neutral-200">
            <Zap
              className="absolute -right-8 -bottom-8 text-white/5 rotate-12"
              size={180}
            />

            <div className="relative z-10 flex flex-col gap-6">
              <div>
                <p className="text-neutral-400 text-[10px] uppercase font-black tracking-[0.3em] mb-2">
                  {t("goals.workout.workout_window.focus")}
                </p>
                <h3 className="text-3xl font-black leading-none">
                  {activeDayInfo?.workout.split(" ")[0]} <br />
                  <span className="text-brand-accent text-xl">
                    {activeDayInfo?.workout.split(" ").slice(1).join(" ")}
                  </span>
                </h3>
              </div>

              <div className="flex justify-between items-end border-t border-white/10 pt-6">
                <div className="flex gap-4">
                  <div>
                    <span className="flex items-center gap-1 text-[9px] font-black text-neutral-500 uppercase mb-1">
                      <Flame size={12} className="text-orange-500" />{" "}
                      {t("goals.workout.workout_window.calories")}
                    </span>
                    <p className="font-black text-xl">
                      ~450{" "}
                      <span className="text-[10px] text-neutral-400">kcal</span>
                    </p>
                  </div>
                  <div className="w-px h-8 bg-white/10 self-center" />
                  <div>
                    <span className="flex items-center gap-1 text-[9px] font-black text-neutral-500 uppercase mb-1">
                      <Clock size={12} className="text-brand-accent" />{" "}
                      {t("goals.workout.workout_window.time")}
                    </span>
                    <p className="font-black text-xl">
                      55{" "}
                      <span className="text-[10px] text-neutral-400">min</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h4 className="font-black uppercase text-neutral-400 text-[10px] tracking-[0.2em]">
                {t("goals.workout.workout_window.exercise_order")}
              </h4>
              <span className="text-[9px] font-bold bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full uppercase">
                {currentExercises.length}{" "}
                {t("goals.workout.workout_window.exercises")}
              </span>
            </div>

            <WorkoutList exercises={currentExercises} isPast={isPast} />
          </div>
        </section>
      ) : (
        <section>
          <div className="grid gap-4">
            {[
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ].map((day) => (
              <div
                key={day}
                className="flex items-center justify-between p-6 bg-white border border-neutral-100 rounded-4xl hover:border-brand-accent/30 cursor-pointer transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-neutral-200 group-hover:bg-brand-accent transition-colors" />
                  <div>
                    <h3 className="font-black text-neutral-800 tracking-tight">
                      {t(
                        `goals.workout.plan_window.week_days.${day}` as TranslationKeys,
                      )}
                    </h3>
                    <p className="text-[10px] font-bold text-neutral-400 group-hover:text-brand-accent transition-colors">
                      PEITO & OMBRO
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ChevronRight
                    size={18}
                    className="text-neutral-200 group-hover:text-brand-accent transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
};

export default WorkoutGoal;
