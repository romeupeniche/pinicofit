import React, { useEffect, useState } from "react";
import {
  Settings2,
  ChevronLeft,
  Dumbbell,
  type LucideIcon,
  Settings,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSettingsStore } from "../../store/settingsStore";
import type { TranslationKeys } from "../../types/i18n";
import WorkoutPlanning from "./WorkoutPlanning";
import { useWorkoutStore } from "../../store/goals/workoutStore";
import ConfirmExitModal from "./ConfirmExitModal";
import WorkoutOverview from "./WorkoutOverview";
import { useAuthStore } from "../../store/authStore";
import FeatureTutorialModal from "../../components/FeatureTutorialModal";
import { api } from "../../services/api";

const titles: Record<string, { title: TranslationKeys; icon: LucideIcon }> = {
  workout: { title: "goals.workout.workout_window.title", icon: Dumbbell },
  plan: { title: "goals.workout.plan_window.title", icon: Settings2 },
};

const WorkoutGoal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("workout");
  const { t } = useSettingsStore();
  const { user } = useAuthStore();

  const {
    logs,
    checkAndGenerateSummaries,
    hasChanges,
    rollbackChanges,
    checkAndMarkFailed,
  } = useWorkoutStore();

  const changesPending = hasChanges();
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(
    !user?.tutorialState?.workout,
  );

  const TitleIcon = titles[activeTab].icon;

  useEffect(() => {
    setShowTutorial(!user?.tutorialState?.workout);
  }, [user?.tutorialState?.workout]);

  useEffect(() => {
    checkAndMarkFailed();
  }, [checkAndMarkFailed]);

  useEffect(() => {
    if (user?.height && user?.weight && user?.age) {
      checkAndGenerateSummaries({
        ...user,
      });
    }
  }, [logs, user, checkAndGenerateSummaries]);

  const handleTabChange = (tab: string) => {
    if (activeTab === "plan" && tab === "workout" && changesPending) {
      setPendingTab(tab);
      setShowExitAlert(true);
    } else {
      setActiveTab(tab);
    }
  };

  const onConfirmExit = () => {
    rollbackChanges();
    if (pendingTab) setActiveTab(pendingTab);
    setShowExitAlert(false);
    setPendingTab(null);
  };

  const closeTutorial = async (dontShowAgain: boolean) => {
    setShowTutorial(false);

    if (!dontShowAgain || !user?.id || user.tutorialState?.workout) {
      return;
    }

    const tutorialState = {
      ...user.tutorialState,
      workout: true,
    };

    const { data } = await api.patch(`/users/${user.id}`, {
      tutorialState,
    });
    useAuthStore.getState().updateProfile(data);
  };

  return (
    <section>
      <header className="sticky top-4 z-50 mb-8 border border-neutral-200/50 flex md:flex-row flex-col md:items-center gap-4 bg-white/60 backdrop-blur-sm rounded-3xl p-4 shadow-sm">
        <div className="flex justify-between flex-1 md:flex-row flex-col gap-4">
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
            <button onClick={() => navigate("/account", { state: { tab: "goals", section: "workoutGoal" } })} className="md:hidden block cursor-pointer ml-auto mr-1 h-9 w-9 border border-white hover:border-brand-accent hover:text-brand-accent text-zinc-400 rounded-2xl transition-colors">
              <Settings className="w-6 h-6 justify-self-center text-inherit" />
            </button>
          </div>
          <div className="flex p-1 rounded-2xl gap-2">
            {(["workout", "plan"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer ${activeTab === tab
                  ? "bg-white text-brand-accent shadow-sm scale-[1.02]"
                  : "text-neutral-400 hover:text-neutral-600 hover:bg-white/30"
                  }`}
              >
                {tab === "workout"
                  ? t("goals.workout.workout_window.badge_title")
                  : t("goals.workout.plan_window.badge_title")}
              </button>
            ))}
            <button onClick={() => setShowTutorial(true)} className="md:hidden block cursor-pointer h-9 w-9 border border-white hover:border-brand-accent hover:text-brand-accent text-zinc-400 rounded-2xl transition-colors">
              <Info className="w-6 h-6 justify-self-center text-inherit" />
            </button>
          </div>
        </div>
        <button onClick={() => navigate("/account", { state: { tab: "goals", section: "workoutGoal" } })} className="md:block hidden cursor-pointer h-12 w-12 border border-white hover:border-brand-accent hover:text-brand-accent text-zinc-400 rounded-2xl transition-colors">
          <Settings className="w-6 h-6 justify-self-center text-inherit" />
        </button>
        <button onClick={() => setShowTutorial(true)} className="md:block hidden cursor-pointer h-12 w-12 border border-white hover:border-brand-accent hover:text-brand-accent text-zinc-400 rounded-2xl transition-colors">
          <Info className="w-6 h-6 justify-self-center text-inherit" />
        </button>
      </header>

      {activeTab === "workout" ? <WorkoutOverview /> : <WorkoutPlanning />}

      {showExitAlert && (
        <ConfirmExitModal
          hasChanges={true}
          rollbackChanges={rollbackChanges}
          manualClose={() => setShowExitAlert(false)}
          manualConfirm={onConfirmExit}
          isLoading={false}
        />
      )}

      {showTutorial && (
        <FeatureTutorialModal
          title={t("tutorials.workout.title")}
          subtitle={t("tutorials.workout.subtitle")}
          closeLabel={t("tutorials.close")}
          steps={[
            {
              title: t("tutorials.workout.steps.plan.title"),
              description: t("tutorials.workout.steps.plan.description"),
            },
            {
              title: t("tutorials.workout.steps.reorder.title"),
              description: t("tutorials.workout.steps.reorder.description"),
            },
            {
              title: t("tutorials.workout.steps.complete.title"),
              description: t("tutorials.workout.steps.complete.description"),
            },
            {
              title: t("tutorials.workout.steps.save_modes.title"),
              description: t("tutorials.workout.steps.save_modes.description"),
            },
          ]}
          dontShowAgainLabel={t("tutorials.do_not_show_again")}
          onContinue={closeTutorial}
        />
      )}
    </section>
  );
};

export default WorkoutGoal;
