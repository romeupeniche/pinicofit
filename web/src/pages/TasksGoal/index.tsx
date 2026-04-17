import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  CheckSquare2,
  ChevronLeft,
  Pencil,
  Plus,
  RefreshCcw,
  Settings,
  Trash2,
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
  const { t } = useSettingsStore();
  const [showTutorial, setShowTutorial] = useState(!user?.tutorialState?.tasks);
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
        const { data } = await api.patch(
          `/tasks/${editingTask.id}`,
          normalizedPayload,
        );
        return data;
      }

      const { data } = await api.post("/tasks", normalizedPayload);
      return data;
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", todayKey] });
      await queryClient.cancelQueries({ queryKey: ["tasks-all"] });
      const previousToday = queryClient.getQueryData<TaskItem[]>(["tasks", todayKey]) || [];
      const previousAll = queryClient.getQueryData<TaskItem[]>(["tasks-all"]) || [];

      const optimisticTask: TaskItem = editingTask
        ? {
          ...editingTask,
          title: payload.title.trim(),
          notes: payload.notes.trim(),
          isDaily: payload.isDaily,
          targetDate: payload.isDaily ? null : payload.targetDate || null,
          reminderAt: null,
        }
        : {
          id: `optimistic-${Date.now()}`,
          title: payload.title.trim(),
          notes: payload.notes.trim(),
          isDaily: payload.isDaily,
          targetDate: payload.isDaily ? null : payload.targetDate || null,
          reminderAt: null,
          lastCompletedDate: null,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

      queryClient.setQueryData<TaskItem[]>(["tasks-all"], (current = []) =>
        editingTask
          ? current.map((task) => (task.id === editingTask.id ? optimisticTask : task))
          : [optimisticTask, ...current],
      );
      queryClient.setQueryData<TaskItem[]>(["tasks", todayKey], (current = []) => {
        const shouldAppearToday =
          optimisticTask.isDaily || optimisticTask.targetDate === todayKey;
        if (!shouldAppearToday) {
          return editingTask ? current.filter((task) => task.id !== editingTask.id) : current;
        }
        return editingTask
          ? current.map((task) => (task.id === editingTask.id ? optimisticTask : task))
          : [optimisticTask, ...current];
      });

      return { previousToday, previousAll };
    },
    onError: (_error, _payload, context) => {
      queryClient.setQueryData(["tasks", todayKey], context?.previousToday || []);
      queryClient.setQueryData(["tasks-all"], context?.previousAll || []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", todayKey] });
      queryClient.invalidateQueries({ queryKey: ["tasks-all"] });
      setShowModal(false);
      setEditingTask(null);
      setForm(emptyTaskForm);
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      await api.patch(`/tasks/${id}`, { completed, date: todayKey });
    },
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", todayKey] });
      await queryClient.cancelQueries({ queryKey: ["tasks-all"] });
      const previousToday = queryClient.getQueryData<TaskItem[]>(["tasks", todayKey]) || [];
      const previousAll = queryClient.getQueryData<TaskItem[]>(["tasks-all"]) || [];
      const apply = (task: TaskItem) =>
        task.id === id ? { ...task, completed, lastCompletedDate: completed ? todayKey : null } : task;
      queryClient.setQueryData<TaskItem[]>(["tasks", todayKey], (current = []) =>
        current.map(apply),
      );
      queryClient.setQueryData<TaskItem[]>(["tasks-all"], (current = []) =>
        current.map(apply),
      );
      return { previousToday, previousAll };
    },
    onError: (_error, _vars, context) => {
      queryClient.setQueryData(["tasks", todayKey], context?.previousToday || []);
      queryClient.setQueryData(["tasks-all"], context?.previousAll || []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", todayKey] });
      queryClient.invalidateQueries({ queryKey: ["tasks-all"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", todayKey] });
      await queryClient.cancelQueries({ queryKey: ["tasks-all"] });
      const previousToday = queryClient.getQueryData<TaskItem[]>(["tasks", todayKey]) || [];
      const previousAll = queryClient.getQueryData<TaskItem[]>(["tasks-all"]) || [];
      queryClient.setQueryData<TaskItem[]>(["tasks", todayKey], (current = []) =>
        current.filter((task) => task.id !== id),
      );
      queryClient.setQueryData<TaskItem[]>(["tasks-all"], (current = []) =>
        current.filter((task) => task.id !== id),
      );
      return { previousToday, previousAll };
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(["tasks", todayKey], context?.previousToday || []);
      queryClient.setQueryData(["tasks-all"], context?.previousAll || []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", todayKey] });
      queryClient.invalidateQueries({ queryKey: ["tasks-all"] });
    },
  });

  const pendingCount = useMemo(
    () => (tasks || []).filter((task) => !task.completed).length,
    [tasks],
  );

  const scheduledTasks = useMemo(
    () =>
      (allTasks || []).filter(
        (task) => !task.isDaily && task.targetDate && task.targetDate >= todayKey,
      ),
    [allTasks, todayKey],
  );

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

  const closeTutorial = async (dontShowAgain: boolean) => {
    setShowTutorial(false);

    if (!dontShowAgain || !user?.id || user.tutorialState?.tasks) {
      return;
    }

    const { data } = await api.patch(`/users/${user.id}`, {
      tutorialState: {
        ...user.tutorialState,
        tasks: true,
      },
    });

    updateProfile(data);
  };

  if (isLoading) {
    return (
      <AppLoadingScreen
        title={t("goals.tasks.title")}
        subtitle={t("goals.tasks.subtitle")}
      />
    );
  }

  return (
    <div className="space-y-8">
      <header className="sticky top-4 z-20 border border-neutral-200/50 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/70 backdrop-blur-sm rounded-3xl p-4 shadow-sm">
        <div className="flex items-center gap-4 self-start">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/50 rounded-xl transition-colors cursor-pointer hover:text-brand-accent"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="p-2 rounded-lg bg-brand-accent/10 text-brand-accent">
            <CheckSquare2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter text-brand-accent">
              {t("goals.tasks.title")}
            </h1>
            <p className="text-sm text-neutral-500">
              {t("goals.tasks.pending_today", {
                count: String(pendingCount),
              })}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-2xl bg-neutral-900 px-4 py-3 text-white cursor-pointer"
          >
            <Plus size={18} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              {t("goals.tasks.add")}
            </span>
          </button>
          <button onClick={() => navigate("/account", { state: { tab: "goals", section: "tasksGoal" }, })} className="cursor-pointer h-10.5 w-10.5 border border-white hover:border-brand-accent hover:text-brand-accent text-zinc-400 rounded-2xl transition-colors">
            <Settings className="w-6 h-6 justify-self-center text-inherit" />
          </button>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-4xl border border-neutral-200 bg-white/60 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-brand-accent/10 p-3 text-brand-accent">
              <RefreshCcw size={18} />
            </div>
            <div>
              <p className="text-sm font-black text-neutral-900">
                {t("goals.tasks.daily")}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                {t("tutorials.tasks.steps.daily.description")}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-4xl border border-neutral-200 bg-white/60 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-brand-accent/10 p-3 text-brand-accent">
              <CalendarDays size={18} />
            </div>
            <div>
              <p className="text-sm font-black text-neutral-900">
                {t("goals.tasks.one_time")}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                {t("tutorials.tasks.steps.dated.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-400">
            {t("goals.tasks.today")}
          </h2>
          {(tasks || []).length === 0 ? (
            <div className="rounded-4xl border border-dashed border-neutral-200 bg-white/40 p-8 text-sm font-medium text-neutral-500">
              {t("goals.tasks.none_today")}
            </div>
          ) : (
            (tasks || []).map((task) => (
              <div
                key={task.id}
                className="rounded-4xl border border-neutral-200 bg-white/60 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <button
                    onClick={() =>
                      toggleMutation.mutate({
                        id: task.id,
                        completed: !task.completed,
                      })
                    }
                    className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-colors cursor-pointer ${task.completed
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-neutral-300 bg-white text-neutral-500"
                      }`}
                    title={
                      task.completed
                        ? t("goals.tasks.incomplete")
                        : t("goals.tasks.complete")
                    }
                  >
                    <Check size={18} />
                  </button>

                  <button
                    onClick={() => openEdit(task)}
                    className="flex-1 text-left cursor-pointer"
                  >
                    <p
                      className={`font-bold ${task.completed
                        ? "line-through text-neutral-400"
                        : "text-neutral-900"
                        }`}
                    >
                      {task.title}
                    </p>
                    {task.notes && (
                      <p className="mt-2 text-sm text-neutral-500">{task.notes}</p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400">
                      <span className="rounded-full bg-neutral-100 px-3 py-1">
                        {task.isDaily
                          ? t("goals.tasks.daily")
                          : t("goals.tasks.one_time")}
                      </span>
                    </div>
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(task)}
                      className="rounded-2xl bg-white p-3 text-brand-accent cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(task.id)}
                      className="rounded-2xl bg-white p-3 text-red-500 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-400">
            {t("goals.tasks.scheduled")}
          </h2>
          {(scheduledTasks || []).length === 0 ? (
            <div className="rounded-4xl border border-dashed border-neutral-200 bg-white/40 p-8 text-sm font-medium text-neutral-500">
              {t("goals.tasks.none_scheduled")}
            </div>
          ) : (
            scheduledTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => openEdit(task)}
                className="w-full rounded-4xl border border-neutral-200 bg-white/60 p-5 shadow-sm text-left cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-neutral-900">{task.title}</p>
                    <p className="mt-2 text-sm text-neutral-500">
                      {task.targetDate
                        ? new Date(`${task.targetDate}T00:00:00`).toLocaleDateString()
                        : "--"}
                    </p>
                  </div>
                  <CalendarDays size={18} className="text-brand-accent" />
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {showModal && (
        <div
          className="fixed inset-0 z-130 flex items-end justify-center bg-black/70 p-4 sm:items-center"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowModal(false);
            }
          }}
        >
          <div className="w-full max-w-xl rounded-4xl bg-white p-6 shadow-2xl max-h-[88vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-neutral-900">
              {editingTask ? t("goals.tasks.edit_task") : t("goals.tasks.new_task")}
            </h2>

            <div className="mt-6 space-y-4">
              <div>
                <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  {t("goals.tasks.title_label")}
                </p>
                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder={t("goals.tasks.title_placeholder")}
                  className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">
                  {t("goals.tasks.notes_label")}
                </p>
                <textarea
                  value={form.notes}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, notes: event.target.value }))
                  }
                  placeholder={t("goals.tasks.notes_placeholder")}
                  className="h-28 w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-brand-accent"
                />
              </div>

              <label className="flex items-center gap-3 rounded-2xl border border-neutral-200 px-4 py-4">
                <input
                  type="checkbox"
                  checked={form.isDaily}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isDaily: event.target.checked,
                      targetDate: event.target.checked ? "" : current.targetDate,
                    }))
                  }
                  className="h-4 w-4 accent-brand-accent"
                />
                <div>
                  <p className="text-sm font-semibold text-neutral-700">
                    {t("goals.tasks.daily_label")}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {t("tutorials.tasks.steps.daily.description")}
                  </p>
                </div>
              </label>

              {!form.isDaily && (
                <div>
                  <p className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">
                    {t("goals.tasks.target_date")}
                  </p>
                  <input
                    type="date"
                    value={form.targetDate}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        targetDate: event.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 outline-none focus:border-brand-accent"
                  />
                </div>
              )}

            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-2xl border border-neutral-200 px-5 py-3 font-bold text-neutral-600 cursor-pointer"
              >
                {t("goals.tasks.cancel")}
              </button>
              <button
                onClick={() => saveMutation.mutate(form)}
                disabled={!form.title.trim() || saveMutation.isPending}
                className="rounded-2xl bg-brand-accent px-5 py-3 font-black uppercase tracking-[0.2em] text-black cursor-pointer disabled:opacity-50"
              >
                {t("goals.tasks.save")}
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
            {
              title: t("tutorials.tasks.steps.daily.title"),
              description: t("tutorials.tasks.steps.daily.description"),
            },
            {
              title: t("tutorials.tasks.steps.dated.title"),
              description: t("tutorials.tasks.steps.dated.description"),
            },
            {
              title: t("tutorials.tasks.steps.dashboard.title"),
              description: t("tutorials.tasks.steps.dashboard.description"),
            },
          ]}
          onContinue={closeTutorial}
        />
      )}
    </div>
  );
};

export default TasksGoal;
