import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  startOfDay,
  differenceInDays,
  parseISO,
  subDays,
  isWithinInterval,
  isBefore,
} from "date-fns";
import type { IExercise } from "../../schemas/WorkoutGoal";
import processPendingSummaries, {
  type Summary,
} from "../../utils/processPendingSummaries";
import type { User } from "../../types/auth";

export interface ICycleStep {
  id: string;
  label: string;
  type: "workout" | "rest";
  name: string;
  exercises: IExercise[];
  isConfigured: boolean;
}

interface IWorkoutHistory {
  startDate: string;
  endDate: string;
  cycle: ICycleStep[];
}

export interface IWorkoutPreset {
  name: string;
  exercises: IExercise[];
  presetTranslationKey?: string;
}

export type ExerciseStatus = "done" | "failed" | "increased";

export interface IExerciseLog {
  date: string;
  exerciseId: string;
  status: ExerciseStatus;
  actualWeight?: string;
}

interface WorkoutState {
  cycle: ICycleStep[];
  startDate: string;
  history: IWorkoutHistory[];
  presets: IWorkoutPreset[];
  lastSavedCycle: string;
  lastSavedStartDate: string;
  isLoading: boolean;
  logs: IExerciseLog[];
  summaries: Summary[];
  saveExerciseLog: (log: IExerciseLog) => void;
  setCycle: (newCycle: ICycleStep[]) => void;
  setStartDate: (date: string) => void;
  addPreset: (preset: IWorkoutPreset) => void;
  removePreset: (index: number) => void;
  saveChanges: () => Promise<void>;
  rollbackChanges: () => void;
  getWorkoutForDate: (date: Date) => ICycleStep | null;
  checkAndMarkFailed: () => void;
  hasChanges: () => boolean;
  checkAndGenerateSummaries: (userSettings: User) => void;
}

const initialCycle: ICycleStep[] = [
  {
    id: "1",
    label: "Treino A",
    type: "workout",
    name: "Peito e Tríceps",
    exercises: [],
    isConfigured: true,
  },
  {
    id: "2",
    label: "Descanso",
    type: "rest",
    name: "",
    exercises: [],
    isConfigured: true,
  },
];

const initialDate = startOfDay(new Date()).toISOString();

const initialPresets: IWorkoutPreset[] = [
  {
    name: "goals.workout.presets.preset-chest-triceps.title",
    exercises: [
      {
        id: "preset-supino-reto-barra",
        name: "Supino Reto com Barra",
        sets: "4",
        reps: "10",
        category: "exercise",
        group: "CHEST_COMPOUND",
        obs: "Foco em progressão de carga, descida controlada",
        rest: "2:00",
        technique: "standard",
        weight: "40",
      },
      {
        id: "preset-supino-inclinado-halteres",
        name: "Supino Inclinado com Halteres",
        sets: "3",
        reps: "10",
        category: "exercise",
        group: "CHEST_COMPOUND",
        obs: "Inclinação de 30º a 45º",
        rest: "1:30",
        technique: "standard",
        weight: "30",
      },
      {
        id: "preset-crucifixo-maquina",
        name: "Crucifixo Máquina (Peck Deck)",
        sets: "3",
        reps: "12",
        category: "exercise",
        group: "CHEST_COMPOUND",
        obs: "Pico de contração de 1s no meio",
        rest: "1:00",
        technique: "standard",
        weight: "50",
      },
      {
        id: "preset-crossover-polia-alta",
        name: "Crossover Polia Alta",
        sets: "3",
        reps: "15",
        category: "exercise",
        group: "CHEST_COMPOUND",
        obs: "Foco na parte inferior do peitoral",
        rest: "1:00",
        technique: "standard",
        weight: "20",
      },
      {
        id: "preset-triceps-pulley-corda",
        name: "Tríceps Pulley Corda",
        sets: "4",
        reps: "12",
        category: "exercise",
        group: "TRICEPS_ISOLATED",
        obs: "Abrir a corda no final do movimento",
        rest: "1:00",
        technique: "standard",
        weight: "25",
      },
      {
        id: "preset-triceps-testa-barra-ez",
        name: "Tríceps Testa Barra EZ",
        sets: "3",
        reps: "10",
        category: "exercise",
        group: "TRICEPS_ISOLATED",
        obs: "Cuidado com os cotovelos, manter fechados",
        rest: "1:30",
        technique: "standard",
        weight: "15",
      },
      {
        id: "preset-triceps-frances-halter",
        name: "Tríceps Francês Bilateral",
        sets: "3",
        reps: "12",
        category: "exercise",
        group: "TRICEPS_ISOLATED",
        obs: "Máximo alongamento da fibra",
        rest: "1:00",
        technique: "standard",
        weight: "20",
      },
    ],
    presetTranslationKey: "goals.workout.presets.preset-chest-triceps",
  },
  {
    name: "goals.workout.presets.preset-back-biceps.title",
    exercises: [
      {
        id: "preset-puxada-pulley-frente",
        name: "Puxada Aberta no Pulley",
        sets: "4",
        reps: "10",
        category: "exercise",
        group: "BACK_COMPOUND",
        obs: "Foco na expansão das dorsais",
        rest: "1:30",
        technique: "standard",
        weight: "50",
      },
      {
        id: "preset-remada-curvada-barra",
        name: "Remada Curvada com Barra",
        sets: "3",
        reps: "10",
        category: "exercise",
        group: "BACK_COMPOUND",
        obs: "Pegada supinada para maior ativação",
        rest: "2:00",
        technique: "standard",
        weight: "40",
      },
      {
        id: "preset-remada-unilateral-serrote",
        name: "Remada Unilateral (Serrote)",
        sets: "3",
        reps: "10",
        category: "exercise",
        group: "BACK_COMPOUND",
        obs: "Manter o tronco paralelo ao banco",
        rest: "1:00",
        technique: "standard",
        weight: "26",
      },
      {
        id: "preset-pull-down-corda",
        name: "Pull Down com Corda",
        sets: "3",
        reps: "15",
        category: "exercise",
        group: "BACK_COMPOUND",
        obs: "Braços quase esticados, foco no lats",
        rest: "1:00",
        technique: "standard",
        weight: "20",
      },
      {
        id: "preset-rosca-direta-barra-ez",
        name: "Rosca Direta Barra EZ",
        sets: "4",
        reps: "10",
        category: "exercise",
        group: "BICEPS_ISOLATED",
        obs: "Sem balançar o corpo, cotovelos fixos",
        rest: "1:30",
        technique: "standard",
        weight: "15",
      },
      {
        id: "preset-rosca-martelo-halteres",
        name: "Rosca Martelo com Halteres",
        sets: "3",
        reps: "12",
        category: "exercise",
        group: "BICEPS_ISOLATED",
        obs: "Foco no braquiorradial e braquial",
        rest: "1:00",
        technique: "standard",
        weight: "14",
      },
      {
        id: "preset-rosca-concentrada-halter",
        name: "Rosca Concentrada Unilateral",
        sets: "3",
        reps: "12",
        category: "exercise",
        group: "BICEPS_ISOLATED",
        obs: "Pico de contração no topo",
        rest: "1:00",
        technique: "standard",
        weight: "12",
      },
    ],
    presetTranslationKey: "goals.workout.presets.preset-back-biceps",
  },
  {
    name: "goals.workout.presets.preset-legs-shoulders.title",
    exercises: [
      {
        id: "preset-agachamento-livre-barra",
        name: "Agachamento Livre com Barra",
        sets: "4",
        reps: "10",
        category: "exercise",
        group: "LEGS_COMPOUND",
        obs: "Descida controlada, foco na amplitude máxima",
        rest: "2:30",
        technique: "standard",
        weight: "60",
      },
      {
        id: "preset-leg-press-45",
        name: "Leg Press 45º",
        sets: "4",
        reps: "12",
        category: "exercise",
        group: "LEGS_COMPOUND",
        obs: "Pés na largura dos ombros, sem travar o joelho",
        rest: "2:00",
        technique: "standard",
        weight: "160",
      },
      {
        id: "preset-extensora-maquina",
        name: "Cadeira Extensora",
        sets: "3",
        reps: "15",
        category: "exercise",
        group: "LEGS_ISOLATED",
        obs: "Pico de contração de 2s no topo",
        rest: "1:00",
        technique: "standard",
        weight: "45",
      },
      {
        id: "preset-mesa-flexora",
        name: "Mesa Flexora (Posterior)",
        sets: "4",
        reps: "12",
        category: "exercise",
        group: "LEGS_ISOLATED",
        obs: "Foco no alongamento do posterior",
        rest: "1:30",
        technique: "standard",
        weight: "35",
      },
      {
        id: "preset-stiff-com-halteres",
        name: "Stiff com Halteres",
        sets: "3",
        reps: "10",
        category: "exercise",
        group: "LEGS_COMPOUND",
        obs: "Coluna reta, sentir alongar o posterior",
        rest: "1:30",
        technique: "standard",
        weight: "24",
      },
      {
        id: "preset-desenvolvimento-ombros-halter",
        name: "Desenvolvimento com Halteres",
        sets: "3",
        reps: "10",
        category: "exercise",
        group: "SHOULDERS",
        obs: "Sentado, foco no deltoide anterior",
        rest: "1:30",
        technique: "standard",
        weight: "18",
      },
      {
        id: "preset-elevacao-lateral-polia",
        name: "Elevação Lateral na Polia",
        sets: "4",
        reps: "15",
        category: "exercise",
        group: "SHOULDERS",
        obs: "Cabo passando por trás do corpo",
        rest: "1:00",
        technique: "standard",
        weight: "10",
      },
    ],
    presetTranslationKey: "goals.workout.presets.preset-legs-shoulders",
  },
  {
    name: "goals.workout.presets.preset-abs-core.title",
    exercises: [
      {
        id: "preset-abd-infra-paralela",
        name: "Abdominal Infra na Paralela",
        sets: "4",
        reps: "15",
        category: "exercise",
        group: "ABS_CORE",
        obs: "Foco na elevação da pelve",
        rest: "1:00",
        technique: "standard",
        weight: "0",
      },
      {
        id: "preset-abd-crunches-polia",
        name: "Abdominal Supra na Polia",
        sets: "4",
        reps: "20",
        category: "exercise",
        group: "ABS_CORE",
        obs: "Carga moderada, foco na contração",
        rest: "1:00",
        technique: "standard",
        weight: "45",
      },
      {
        id: "preset-abd-obliquo-polia",
        name: "Abdominal Oblíquo na Polia",
        sets: "3",
        reps: "15",
        category: "exercise",
        group: "ABS_CORE",
        obs: "Giro de tronco controlado",
        rest: "1:00",
        technique: "standard",
        weight: "20",
      },
      {
        id: "preset-core-plancha",
        name: "Prancha Abdominal",
        sets: "3",
        reps: "1",
        category: "exercise",
        group: "ABS_CORE",
        obs: "Manter contração máxima por 1 min",
        rest: "1:00",
        technique: "standard",
        weight: "0",
      },
      {
        id: "preset-lombar-extensao-banco",
        name: "Extensão Lombar no Banco 45º",
        sets: "3",
        reps: "15",
        category: "exercise",
        group: "ABS_CORE",
        obs: "Subida controlada, não hiperestender demais",
        rest: "1:30",
        technique: "standard",
        weight: "10",
      },
      {
        id: "preset-lombar-superman",
        name: "Superman (Solo)",
        sets: "3",
        reps: "15",
        category: "exercise",
        group: "ABS_CORE",
        obs: "Foco na contração isométrica de 2s no topo",
        rest: "1:00",
        technique: "standard",
        weight: "0",
      },
    ],
    presetTranslationKey: "goals.workout.presets.preset-abs-core",
  },
  {
    name: "goals.workout.presets.preset-fb-performance.title",
    exercises: [
      {
        id: "preset-fb-agachamento",
        name: "Agachamento Livre",
        sets: "4",
        reps: "10",
        category: "exercise",
        group: "LEGS_COMPOUND",
        obs: "Composto base de membros inferiores",
        rest: "2:00",
        technique: "standard",
        weight: "60",
      },
      {
        id: "preset-fb-supino-reto",
        name: "Supino Reto com Barra",
        sets: "3",
        reps: "6",
        category: "exercise",
        group: "CHEST_COMPOUND",
        obs: "Foco em força",
        rest: "1:30",
        technique: "standard",
        weight: "50",
      },
      {
        id: "preset-fb-puxada-frente",
        name: "Puxada Aberta Pulley",
        sets: "3",
        reps: "10",
        category: "exercise",
        group: "BACK_COMPOUND",
        obs: "Foco em largura",
        rest: "1:30",
        technique: "standard",
        weight: "50",
      },
      {
        id: "preset-fb-desenvolvimento-halter",
        name: "Desenvolvimento de Ombros",
        sets: "3",
        reps: "10",
        category: "exercise",
        group: "SHOULDERS",
        obs: "Sentado com halteres",
        rest: "1:30",
        technique: "standard",
        weight: "20",
      },
      {
        id: "preset-fb-stiff",
        name: "Stiff com Halteres",
        sets: "3",
        reps: "10",
        category: "exercise",
        group: "LEGS_COMPOUND",
        obs: "Foco em posterior de coxa",
        rest: "1:30",
        technique: "standard",
        weight: "24",
      },
      {
        id: "preset-fb-rosca-martelo",
        name: "Rosca Martelo",
        sets: "3",
        reps: "12",
        category: "exercise",
        group: "BICEPS_ISOLATED",
        obs: "Trabalho de braço",
        rest: "1:00",
        technique: "standard",
        weight: "14",
      },
      {
        id: "preset-fb-triceps-corda",
        name: "Tríceps Corda",
        sets: "3",
        reps: "12",
        category: "exercise",
        group: "TRICEPS_ISOLATED",
        obs: "Finalização de braço",
        rest: "1:00",
        technique: "standard",
        weight: "20",
      },
    ],
    presetTranslationKey: "goals.workout.presets.preset-fb-performance",
  },
  {
    name: "goals.workout.presets.preset-fb-calisthenics-pro.title",
    exercises: [
      {
        id: "preset-cali-barra-fixa-pronada",
        name: "Barra Fixa (Pull Ups)",
        sets: "4",
        reps: "10",
        category: "exercise",
        group: "CALI_UPPER_COMPOUND",
        obs: "Pegada aberta, peito na barra",
        rest: "2:00",
        technique: "standard",
        weight: "0",
      },
      {
        id: "preset-cali-paralelas-peito",
        name: "Dips nas Paralelas",
        sets: "4",
        reps: "12",
        category: "exercise",
        group: "CALI_UPPER_COMPOUND",
        obs: "Inclinar o tronco para frente para focar no peito",
        rest: "1:30",
        technique: "standard",
        weight: "0",
      },
      {
        id: "preset-cali-agachamento-bulgaro",
        name: "Agachamento Búlgaro",
        sets: "3",
        reps: "12",
        category: "exercise",
        group: "CALI_LOWER_COMPOUND",
        obs: "Uma perna de cada vez, foco em profundidade",
        rest: "1:30",
        technique: "standard",
        weight: "0",
      },
      {
        id: "preset-cali-flexao-arqueiro",
        name: "Flexão Arqueiro (Archer Pushups)",
        sets: "3",
        reps: "10",
        category: "exercise",
        group: "CALI_UPPER_COMPOUND",
        obs: "Alternando os lados para aumentar a carga unilateral",
        rest: "1:30",
        technique: "standard",
        weight: "0",
      },
      {
        id: "preset-cali-chin-ups",
        name: "Chin-Ups (Barra Supinada)",
        sets: "3",
        reps: "10",
        category: "exercise",
        group: "CALI_UPPER_COMPOUND",
        obs: "Foco na contração máxima do bíceps no topo",
        rest: "1:30",
        technique: "standard",
        weight: "0",
      },
      {
        id: "preset-cali-flexao-diamante",
        name: "Flexão Diamante",
        sets: "3",
        reps: "15",
        category: "exercise",
        group: "CALI_UPPER_COMPOUND",
        obs: "Mãos juntas formando um diamante",
        rest: "1:00",
        technique: "standard",
        weight: "0",
      },
      {
        id: "preset-cali-elevacao-pernas-barra",
        name: "Elevação de Pernas na Barra",
        sets: "4",
        reps: "12",
        category: "exercise",
        group: "CALI_CORE_ADVANCED",
        obs: "Sem balanço (momentum), subida explosiva",
        rest: "1:00",
        technique: "standard",
        weight: "0",
      },
    ],
    presetTranslationKey: "goals.workout.presets.preset-fb-calisthenics-pro",
  },
  {
    name: "goals.workout.presets.preset-cardio-burn-hiit.title",
    exercises: [
      {
        id: "preset-cardio-bike-hiit",
        name: "Bike HIIT (Intervalado)",
        sets: "10",
        reps: "1",
        category: "exercise",
        group: "CARDIO_HIIT",
        obs: "30s sprint máximo / 30s leve",
        rest: "0:00",
        technique: "standard",
        weight: "0",
      },
      {
        id: "preset-cardio-esteira-incl",
        name: "Esteira Inclinada",
        sets: "1",
        reps: "1",
        category: "exercise",
        group: "CARDIO_STEADY",
        obs: "15 min / Inclinação 12% / 5.0km/h",
        rest: "0:00",
        technique: "standard",
        weight: "0",
      },
      {
        id: "preset-cardio-burpees",
        name: "Burpees",
        sets: "4",
        reps: "20",
        category: "exercise",
        group: "CALI_UPPER_COMPOUND",
        obs: "45 segundos de execução",
        rest: "1:00",
        technique: "standard",
        weight: "0",
      },
      {
        id: "preset-cardio-corda",
        name: "Pular Corda",
        sets: "5",
        reps: "100",
        category: "exercise",
        group: "CARDIO_HIIT",
        obs: "2 min constantes",
        rest: "1:00",
        technique: "standard",
        weight: "0",
      },
      {
        id: "preset-cardio-mountain-climber",
        name: "Mountain Climber",
        sets: "4",
        reps: "30",
        category: "exercise",
        group: "ABS_CORE",
        obs: "Foco em ritmo cardíaco alto",
        rest: "1:00",
        technique: "standard",
        weight: "0",
      },
      {
        id: "preset-cardio-polichinelos",
        name: "Polichinelos",
        sets: "4",
        reps: "50",
        category: "exercise",
        group: "CARDIO_HIIT",
        obs: "Execução rápida para finalizar",
        rest: "0:30",
        technique: "standard",
        weight: "0",
      },
    ],
    presetTranslationKey: "goals.workout.presets.preset-cardio-burn-hiit",
  },
];

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      cycle: initialCycle,
      startDate: initialDate,
      history: [],
      logs: [],
      summaries: [],
      presets: initialPresets,
      lastSavedCycle: JSON.stringify(initialCycle),
      lastSavedStartDate: initialDate,
      isLoading: false,

      setCycle: (newCycle) => set({ cycle: [...newCycle] }),

      saveExerciseLog: (newLog) =>
        set((state) => {
          const filteredLogs = state.logs.filter(
            (l) =>
              !(l.date === newLog.date && l.exerciseId === newLog.exerciseId),
          );
          return { logs: [...filteredLogs, newLog] };
        }),

      setStartDate: (date) =>
        set({ startDate: startOfDay(parseISO(date)).toISOString() }),

      addPreset: (preset) =>
        set((state) => ({ presets: [preset, ...state.presets] })),

      removePreset: (index) =>
        set((state) => ({
          presets: state.presets.filter((_, i) => i !== index),
        })),

      rollbackChanges: () => {
        const { lastSavedCycle, lastSavedStartDate } = get();
        set({
          cycle: JSON.parse(lastSavedCycle),
          startDate: lastSavedStartDate,
        });
      },

      hasChanges: () => {
        const { cycle, lastSavedCycle, isLoading } = get();
        if (isLoading) return false;

        const saved = JSON.parse(lastSavedCycle) as typeof cycle;

        if (cycle.length !== saved.length) return true;

        for (let i = 0; i < cycle.length; i++) {
          const current = cycle[i];
          const prev = saved[i];

          if (current.type !== prev.type) return true;

          if (current.type === "workout") {
            if (current.name !== prev.name || current.label !== prev.label) {
              return true;
            }
          }
        }

        return false;
      },

      saveChanges: async () => {
        set({ isLoading: true });

        await new Promise((resolve) => setTimeout(resolve, 800));

        const { cycle, startDate, history, lastSavedCycle } = get();

        const today = startOfDay(new Date());
        const todayIso = today.toISOString();
        const yesterdayIso = subDays(today, 1).toISOString();

        const newHistoryItem: IWorkoutHistory = {
          startDate: startDate,
          endDate: yesterdayIso,
          cycle: JSON.parse(lastSavedCycle),
        };
        set({
          history: [...history, newHistoryItem],
          startDate: todayIso,
          lastSavedStartDate: todayIso,
          lastSavedCycle: JSON.stringify(cycle),
          isLoading: false,
        });
      },

      getWorkoutForDate: (date: Date) => {
        const { cycle, startDate, history, hasChanges } = get();
        const targetDate = startOfDay(date);
        const today = startOfDay(new Date());

        if (targetDate >= today) {
          const referenceDate = hasChanges()
            ? today
            : startOfDay(parseISO(startDate));

          const diff = differenceInDays(targetDate, referenceDate);

          if (diff >= 0) {
            return cycle[diff % cycle.length];
          }
        }
        for (const entry of history) {
          const start = startOfDay(parseISO(entry.startDate));
          const end = startOfDay(parseISO(entry.endDate));

          if (isWithinInterval(targetDate, { start, end })) {
            const diff = Math.abs(differenceInDays(targetDate, start));
            return entry.cycle[diff % entry.cycle.length];
          }
        }

        if (targetDate >= startOfDay(parseISO(startDate))) {
          const diff = Math.abs(
            differenceInDays(targetDate, startOfDay(parseISO(startDate))),
          );
          return cycle[diff % cycle.length];
        }

        return null;
      },

      checkAndMarkFailed: () => {
        const { logs, getWorkoutForDate, saveExerciseLog } = get();
        const now = new Date();
        const today = startOfDay(now);

        if (now.getHours() < 4) return;

        [1, 2, 3].forEach((d) => {
          const checkDate = subDays(today, d);
          const checkDateIso = checkDate.toISOString().split("T")[0];
          const workout = getWorkoutForDate(checkDate);

          if (workout && workout.type === "workout") {
            workout.exercises.forEach((ex) => {
              const hasLog = logs.some(
                (l) => l.date === checkDateIso && l.exerciseId === ex.id,
              );

              if (!hasLog) {
                saveExerciseLog({
                  date: checkDateIso,
                  exerciseId: ex.id,
                  status: "failed",
                  actualWeight: ex.weight,
                });
              }
            });
          }
        });
      },

      checkAndGenerateSummaries: (userSettings: User) => {
        const { logs, summaries, getWorkoutForDate } = get();
        const yesterdayLimit = startOfDay(subDays(new Date(), 1));
        const datesWithLogs = Array.from(new Set(logs.map((l) => l.date)));
        const pendingDates = datesWithLogs.filter((logDate) => {
          const logDateParsed = startOfDay(parseISO(logDate));
          const alreadyDone = summaries.some((s) => s.date === logDate);

          return !alreadyDone && isBefore(logDateParsed, yesterdayLimit);
        });

        if (pendingDates.length === 0) return;

        const newSummaries = pendingDates
          .map((date) => {
            const workoutAtDate = getWorkoutForDate(parseISO(date));

            if (!workoutAtDate || workoutAtDate.type !== "workout") return null;

            return processPendingSummaries({
              dateToProcess: date,
              logs,
              activeWorkout: workoutAtDate,
              userSettings,
            });
          })
          .filter((s) => s !== null);

        if (newSummaries.length > 0) {
          set((state) => ({
            summaries: [...state.summaries, ...newSummaries],
          }));
        }
      },
    }),
    {
      name: "pinicofit-workout-storage",
      partialize: (state) => ({
        cycle: state.cycle,
        startDate: state.startDate,
        logs: state.logs,
        history: state.history,
        presets: state.presets,
        lastSavedCycle: state.lastSavedCycle,
        lastSavedStartDate: state.lastSavedStartDate,
        summaries: state.summaries,
      }),
    },
  ),
);
