import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckSquare2,
  ChevronLeft,
  Info,
  Pencil,
  Plus,
  RefreshCcw,
  Settings,
  Target,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import type { TaskItem } from "../../types/tasks";
import AppLoadingScreen from "../../components/AppLoadingScreen";
import FeatureTutorialModal from "../../components/FeatureTutorialModal";
import { useAuthStore } from "../../store/authStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { getLocalDateKey } from "../../utils/date";
import CustomLoadingSpinner from "../../components/CustomLoadingSpinner";
import { formatDynamicDate } from "../../utils/formatDynamicDate";

type TaskFormState = {
  title: string;
  notes: string;
  isDaily: boolean;
  targetDate: string;
};

const emptyTaskForm: TaskFormState = {
  title: "",
  notes: "",
  isDaily: false,
  targetDate: "",
};

const TasksGoal: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, updateProfile } = useAuthStore();
  const { t, lang } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<"today" | "scheduled">("today");
  const [showTutorial, setShowTutorial] = useState(!user?.preferences.tutorialState?.tasks);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [form, setForm] = useState<TaskFormState>(emptyTaskForm);
  const todayKey = getLocalDateKey();

  useBodyScrollLock(showModal);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", todayKey],
    queryFn: async () => {
      const { data } = await api.get(`/tasks/today?date=${todayKey}`);
      return data as TaskItem[];
    },
  });

  const { data: allTasks } = useQuery({
    queryKey: ["tasks-all"],
    queryFn: async () => {
      const { data } = await api.get("/tasks");
      return data as TaskItem[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: TaskFormState) => {
      const normalizedPayload = {
        ...payload,
        title: payload.title.trim(),
        notes: payload.notes.trim() || undefined,
        targetDate: payload.isDaily ? undefined : payload.targetDate || undefined,
      };

      if (editingTask) {
        const { data } = await api.patch(`/tasks/${editingTask.id}`, normalizedPayload);
        return data;
      }

      const { data } = await api.post("/tasks", normalizedPayload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", todayKey] });
      queryClient.invalidateQueries({ queryKey: ["tasks-all"] });
      closeModal();
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      await api.patch(`/tasks/${id}`, { completed });
    },
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", todayKey] });
      const previousTasks = queryClient.getQueryData<TaskItem[]>(["tasks", todayKey]);

      queryClient.setQueryData<TaskItem[]>(["tasks", todayKey], (old) => {
        return old?.map((task) =>
          task.id === id ? { ...task, completed } : task
        );
      });

      return { previousTasks };
    },
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(["tasks", todayKey], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", todayKey] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", todayKey] });
      await queryClient.cancelQueries({ queryKey: ["tasks-all"] });

      const prevToday = queryClient.getQueryData<TaskItem[]>(["tasks", todayKey]);
      const prevAll = queryClient.getQueryData<TaskItem[]>(["tasks-all"]);

      queryClient.setQueryData<TaskItem[]>(["tasks", todayKey], (old) =>
        old?.filter((task) => task.id !== id)
      );
      queryClient.setQueryData<TaskItem[]>(["tasks-all"], (old) =>
        old?.filter((task) => task.id !== id)
      );

      return { prevToday, prevAll };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(["tasks", todayKey], context?.prevToday);
      queryClient.setQueryData(["tasks-all"], context?.prevAll);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", todayKey] });
      queryClient.invalidateQueries({ queryKey: ["tasks-all"] });
    },
  });

  const scheduledTasks = useMemo(() => {
    if (!allTasks) return [];

    return allTasks.filter((task) => {
      return !task.isDaily && task.targetDate && task.targetDate > todayKey;
    });
  }, [allTasks, todayKey]);

  const openCreate = () => {
    setEditingTask(null);
    setForm(emptyTaskForm);
    setShowModal(true);
  };

  const openEdit = (task: TaskItem) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      notes: task.notes || "",
      isDaily: task.isDaily,
      targetDate: task.targetDate?.slice(0, 10) || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
    setForm(emptyTaskForm);
  };

  const closeTutorial = async (dontShowAgain: boolean) => {
    setShowTutorial(false);
    if (!dontShowAgain || !user?.id || user.preferences.tutorialState?.tasks) return;
    const { data } = await api.patch(`/users/${user.id}`, {
      tutorialState: { ...user.preferences.tutorialState, tasks: true },
    });
    updateProfile(data);
  };

  if (isLoading) {
    return <AppLoadingScreen title={t("goals.tasks.title")} subtitle={t("goals.tasks.subtitle")} />;
  }

  return (
    <div className="space-y-6 pb-20">
      <header className="sticky top-4 z-20 border border-neutral-200/50 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-sm">
        <div className="flex items-center gap-4 self-start">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="p-2 rounded-lg bg-brand-accent/10 text-brand-accent">
            <CheckSquare2 size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              {t("goals.tasks.title")}
            </h1>
            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              {tasks?.length || 0} {t("goals.tasks.title").toLowerCase()} hoje
            </p>
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={openCreate}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-2xl bg-neutral-950 px-5 py-2.5 text-white cursor-pointer hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-200"
          >
            <Plus size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">
              {t("goals.tasks.add")}
            </span>
          </button>
          <button
            onClick={() => navigate("/account", { state: { tab: "goals", section: "tasksGoal" } })}
            className="p-2.5 border border-neutral-200 text-neutral-500 rounded-2xl hover:border-brand-accent hover:text-brand-accent transition-colors cursor-pointer"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={() => setShowTutorial(true)}
            className="p-2.5 border border-neutral-200 text-neutral-500 rounded-2xl hover:border-brand-accent hover:text-brand-accent transition-colors cursor-pointer"
          >
            <Info size={20} />
          </button>
        </div>
      </header>

      <div className="flex p-1 bg-neutral-100 rounded-2xl w-fit mx-auto">
        <button
          onClick={() => setActiveTab("today")}
          className={`px-6 py-2 w-40 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "today" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 cursor-pointer"
            }`}
        >
          {t("goals.tasks.today")}
        </button>
        <button
          onClick={() => setActiveTab("scheduled")}
          className={`px-6 py-2 w-40 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === "scheduled" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 cursor-pointer"
            }`}
        >
          {t("goals.tasks.scheduled")}
        </button>
      </div>

      <main className="min-h-100">
        {activeTab === "today" ? (
          <div className="space-y-3">
            {(tasks || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/40 border border-dashed border-neutral-200 rounded-4xl text-neutral-400">
                <CheckSquare2 size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">{t("goals.tasks.none_today")}</p>
              </div>
            ) : (
              (tasks || []).map((task) => (
                <div
                  key={task.id}
                  className={`group/card relative flex items-center gap-4 rounded-3xl border p-4 transition-all ${task.completed
                    ? "bg-neutral-50/50 border-neutral-100 opacity-75"
                    : "bg-white border-neutral-200 shadow-sm hover:border-brand-accent/40"
                    }`}
                >
                  <button
                    disabled={toggleMutation.isPending}
                    onClick={() => toggleMutation.mutate({ id: task.id, completed: !task.completed })}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${task.completed
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-neutral-200 bg-white text-transparent hover:border-brand-accent"
                      }`}
                  >
                    <Check size={20} strokeWidth={3} />
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold truncate ${task.completed ? "line-through text-neutral-400" : "text-neutral-900"}`}>
                      {task.title}
                    </h3>
                    {task.notes && (
                      <p className="text-sm text-neutral-500 truncate">{task.notes}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {task.completed ? (
                        <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          <Check size={10} strokeWidth={3} /> {t("goals.tasks.completed")}
                        </span>
                      ) : (
                        <>
                          {task.isOverdue ? (
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                              <Zap size={10} fill="currentColor" className="animate-pulse" />
                              {t("goals.tasks.overdue")}
                            </span>
                          ) : null}

                          {task.isDaily ? (
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded-md">
                              <RefreshCcw size={10} /> {t("goals.tasks.daily")}
                            </span>
                          ) : (
                            !task.isOverdue && (
                              <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-md">
                                <CalendarDays size={10} /> {t("goals.tasks.one_time")}
                              </span>
                            )
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(task)}
                      className="cursor-pointer p-2 text-neutral-400 hover:text-brand-accent md:opacity-0 md:group-hover/card:opacity-100 transition-all"
                    >
                      <Pencil size={20} />
                    </button>

                    <button
                      onClick={() => deleteMutation.mutate(task.id)}
                      className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors cursor-pointer group/button"
                    >
                      <Target
                        size={20}
                        className="absolute text-neutral-300 transition-all group-hover/card:opacity-0 group-hover/card:scale-75 hidden md:block"
                      />
                      <Trash2
                        size={20}
                        className="text-neutral-400 group-hover/button:text-red-500 md:absolute transition-all md:opacity-0 md:scale-75 group-hover/card:opacity-100 group-hover/card:scale-100"
                      />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {(scheduledTasks || []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/40 border border-dashed border-neutral-200 rounded-4xl text-neutral-400">
                <CalendarDays size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">{t("goals.tasks.none_scheduled")}</p>
              </div>
            ) : (
              scheduledTasks.map((task) => (
                <div
                  key={task.id}
                  className="group/card relative flex items-center justify-between p-4 rounded-3xl bg-white border border-neutral-200 hover:border-brand-accent/40 transition-all text-left shadow-sm"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 border border-neutral-100">
                      <CalendarDays size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-neutral-900">{task.title}</h3>
                      {task.notes && (
                        <p className="text-sm text-neutral-500 truncate">{task.notes}</p>
                      )}
                      <p className="text-sm text-brand-accent font-medium mt-1">
                        {task.targetDate ? formatDynamicDate(task.targetDate, lang) : "--"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0 ml-4">
                    <button
                      onClick={() => openEdit(task)}
                      className="cursor-pointer p-2 text-neutral-400 hover:text-brand-accent md:opacity-0 md:group-hover/card:opacity-100 transition-all"
                    >
                      <Pencil size={20} />
                    </button>

                    <button
                      onClick={() => deleteMutation.mutate(task.id)}
                      className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors cursor-pointer group/button"
                    >
                      <CalendarDays
                        size={20}
                        className="absolute text-neutral-300 transition-all group-hover/card:opacity-0 group-hover/card:scale-75 hidden md:block"
                      />
                      <Trash2
                        size={20}
                        className="text-neutral-400 group-hover/button:text-red-500 md:absolute transition-all md:opacity-0 md:scale-75 group-hover/card:opacity-100 group-hover/card:scale-100"
                      />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 z-150 flex items-end justify-center bg-neutral-950/60 backdrop-blur-sm p-4 sm:items-center" onClick={closeModal}>
          <div className="w-full max-w-lg rounded-[2.5rem] bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
                {editingTask ? t("goals.tasks.edit_task") : t("goals.tasks.new_task")}
              </h2>
              <button onClick={closeModal} className="cursor-pointer p-2 bg-neutral-100 rounded-full text-neutral-500 hover:text-neutral-900 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                  {t("goals.tasks.title_label")}
                </label>
                <input
                  autoFocus
                  value={form.title}
                  onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))}
                  placeholder={t("goals.tasks.title_placeholder")}
                  className="w-full rounded-2xl bg-neutral-50 border border-neutral-200 px-5 py-4 text-neutral-900 outline-none focus:border-brand-accent focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                  {t("goals.tasks.notes_label")}
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((c) => ({ ...c, notes: e.target.value }))}
                  placeholder={t("goals.tasks.notes_placeholder")}
                  className="h-24 w-full rounded-2xl bg-neutral-50 border border-neutral-200 px-5 py-4 text-neutral-900 outline-none focus:border-brand-accent focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="flex flex-col gap-4">
                <label className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${form.isDaily ? "border-brand-accent bg-brand-accent/5" : "border-neutral-100 bg-neutral-50 hover:border-neutral-200"
                  }`}>
                  <div className="flex items-center gap-3">
                    <RefreshCcw size={20} className={form.isDaily ? "text-brand-accent" : "text-neutral-400"} />
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{t("goals.tasks.daily_label")}</p>
                      <p className="text-[11px] text-neutral-500">{t("tutorials.tasks.steps.daily.description")}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isDaily}
                    onChange={(e) => setForm((c) => ({
                      ...c,
                      isDaily: e.target.checked,
                      targetDate: e.target.checked ? "" : c.targetDate,
                    }))}
                    className="hidden"
                  />
                </label>

                {!form.isDaily && (
                  <div className="space-y-2">
                    <label htmlFor="targetDate" className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
                      {t("goals.tasks.target_date")}
                    </label>
                    <label className="relative flex items-center group cursor-pointer active:scale-[0.99] transition-transform">
                      <CalendarDays
                        className="absolute left-5 text-neutral-400 group-hover:text-brand-accent group-focus-within:text-brand-accent transition-colors"
                        size={20}
                      />
                      <input
                        id="targetDate"
                        name="targetDate"
                        type="date"
                        value={form.targetDate}
                        onClick={(e) => e.currentTarget.showPicker()}
                        onChange={(e) => setForm((c) => ({ ...c, targetDate: e.target.value }))}
                        className={`
                            w-full rounded-2xl bg-neutral-50 border px-5 py-4 pl-14 
                            text-neutral-900 outline-none transition-all cursor-pointer
                            hover:bg-neutral-100/50
                            ${!form.isDaily && !form.targetDate
                            ? "border-red-300"
                            : "border-neutral-100 group-hover:border-neutral-200 focus:border-brand-accent focus:bg-white"
                          }
                                 `}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3">
              <button
                onClick={closeModal}
                className="cursor-pointer rounded-2xl py-4 font-bold text-neutral-500 hover:bg-neutral-100 transition-colors"
              >
                {t("goals.tasks.cancel")}
              </button>
              <button
                onClick={() => saveMutation.mutate(form)}
                disabled={
                  !form.title.trim() ||
                  saveMutation.isPending ||
                  (!form.isDaily && !form.targetDate)
                }
                className="cursor-pointer rounded-2xl bg-brand-accent/90 hover:bg-brand-accent py-4 font-black uppercase tracking-widest text-white disabled:opacity-50 active:scale-95 transition-all"
              >
                {saveMutation.isPending ? <span className="w-full flex items-center justify-center"><CustomLoadingSpinner className="text-white w-6 h-6" /></span> : t("goals.tasks.save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTutorial && (
        <FeatureTutorialModal
          title={t("tutorials.tasks.title")}
          subtitle={t("tutorials.tasks.subtitle")}
          closeLabel={t("tutorials.close")}
          dontShowAgainLabel={t("tutorials.do_not_show_again")}
          steps={[
            { title: t("tutorials.tasks.steps.daily.title"), description: t("tutorials.tasks.steps.daily.description") },
            { title: t("tutorials.tasks.steps.dated.title"), description: t("tutorials.tasks.steps.dated.description") },
            { title: t("tutorials.tasks.steps.dashboard.title"), description: t("tutorials.tasks.steps.dashboard.description") },
          ]}
          onContinue={closeTutorial}
        />
      )}
    </div>
  );
};

export default TasksGoal;