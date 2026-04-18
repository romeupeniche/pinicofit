import React, { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  ChevronLeft,
  Clock3,
  Moon,
  Sunrise,
  Pencil,
  Trash2,
  Settings,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import AppLoadingScreen from "../../components/AppLoadingScreen";
import type { SleepLog } from "../../types/sleep";
import { useAuthStore } from "../../store/authStore";
import FeatureTutorialModal from "../../components/FeatureTutorialModal";
import { useSettingsStore } from "../../store/settingsStore";
import { getLocalDateKey } from "../../utils/date";
import CustomLoadingSpinner from "../../components/CustomLoadingSpinner";

const hoursBetween = (start: string, end: string) => {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  const startDate = new Date(2026, 0, 1, startHour, startMinute);
  const endDate = new Date(2026, 0, 1, endHour, endMinute);

  if (endDate <= startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  return Number(((endDate.getTime() - startDate.getTime()) / 3600000).toFixed(2));
};

const addHoursToTime = (baseTime: string, hours: number) => {
  const [baseHour, baseMinute] = baseTime.split(":").map(Number);
  const date = new Date(2026, 0, 1, baseHour, baseMinute);
  date.setMinutes(date.getMinutes() + Math.round(hours * 60));

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const subtractHoursFromTime = (baseTime: string, hours: number) =>
  addHoursToTime(baseTime, -hours);

const SleepGoal: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, updateProfile } = useAuthStore();
  const { t } = useSettingsStore();
  const [showTutorial, setShowTutorial] = useState(!user?.tutorialState?.sleep);
  const [mainDuration, setMainDuration] = useState("8");
  const [sleptAt, setSleptAt] = useState("01:00");
  const [wokeAt, setWokeAt] = useState("09:00");
  const [napDuration, setNapDuration] = useState("0");
  const [napStart, setNapStart] = useState("15:00");
  const [napEnd, setNapEnd] = useState("15:00");
  const [editingDateKey, setEditingDateKey] = useState<string | null>(null);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const todayKey = getLocalDateKey();
  const activeDateKey = editingDateKey || todayKey;

  const { data: todayLog, isLoading } = useQuery({
    queryKey: ["sleep-today", todayKey],
    queryFn: async () => {
      const { data } = await api.get(`/sleep/today?date=${todayKey}`);
      return data as (SleepLog & {
        napDurationHours?: number;
        napStart?: string | null;
        napEnd?: string | null;
      }) | null;
    },
  });

  const { data: sleepHistory } = useQuery({
    queryKey: ["sleep-history"],
    queryFn: async () => {
      const { data } = await api.get("/sleep/history?period=week");
      return data as Array<
        SleepLog & {
          napDurationHours?: number;
          napStart?: string | null;
          napEnd?: string | null;
        }
      >;
    },
  });

  useEffect(() => {
    if (!todayLog) return;

    const main = Math.max(
      Number(todayLog.durationHours || 0) - Number(todayLog.napDurationHours || 0),
      0,
    );

    setMainDuration(String(main || 8));
    setNapDuration(String(Number(todayLog.napDurationHours || 0)));

    if (todayLog.sleptAt) {
      setSleptAt(new Date(todayLog.sleptAt).toISOString().slice(11, 16));
    }

    if (todayLog.wokeAt) {
      setWokeAt(new Date(todayLog.wokeAt).toISOString().slice(11, 16));
    }

    if (todayLog.napStart) {
      setNapStart(new Date(todayLog.napStart).toISOString().slice(11, 16));
    }

    if (todayLog.napEnd) {
      setNapEnd(new Date(todayLog.napEnd).toISOString().slice(11, 16));
    }
  }, [todayLog]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const mainSleepHours = Number(mainDuration || 0);
      const napHours = Number(napDuration || 0);

      const sleptAtIso = `${activeDateKey}T${sleptAt}:00`;
      const wokeAtIso = `${activeDateKey}T${wokeAt}:00`;
      const napStartIso = napHours > 0 ? `${activeDateKey}T${napStart}:00` : undefined;
      const napEndIso = napHours > 0 ? `${activeDateKey}T${napEnd}:00` : undefined;

      const { data } = await api.post("/sleep/log", {
        date: activeDateKey,
        sleptAt: sleptAtIso,
        wokeAt: wokeAtIso,
        durationHours: mainSleepHours,
        napDurationHours: napHours,
        napStart: napStartIso,
        napEnd: napEndIso,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleep-today"] });
      queryClient.invalidateQueries({ queryKey: ["sleep-history"] });
      setShowOverwriteConfirm(false);
      setEditingDateKey(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/sleep/log/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleep-today"] });
      queryClient.invalidateQueries({ queryKey: ["sleep-history"] });
      setEditingDateKey(null);
    },
  });

  const sleepGoal = user?.sleepGoal || 8;
  const totalToday = Number(mainDuration || 0) + Number(napDuration || 0);
  const progress = Math.min((totalToday / sleepGoal) * 100, 100);

  const averageSleep = useMemo(() => {
    if (!sleepHistory?.length) return "0.0";
    return (
      sleepHistory.reduce((sum, item) => sum + Number(item.durationHours || 0), 0) /
      sleepHistory.length
    ).toFixed(1);
  }, [sleepHistory]);

  const hydrateFormFromLog = (
    log: (SleepLog & {
      napDurationHours?: number;
      napStart?: string | null;
      napEnd?: string | null;
    }) | null,
    dateKey: string,
  ) => {
    setEditingDateKey(dateKey === todayKey ? null : dateKey);

    if (!log) {
      setMainDuration("8");
      setSleptAt("01:00");
      setWokeAt("09:00");
      setNapDuration("0");
      setNapStart("15:00");
      setNapEnd("15:00");
      return;
    }

    const main = Math.max(
      Number(log.durationHours || 0) - Number(log.napDurationHours || 0),
      0,
    );

    setMainDuration(String(main || 8));
    setNapDuration(String(Number(log.napDurationHours || 0)));
    setSleptAt(log.sleptAt ? new Date(log.sleptAt).toISOString().slice(11, 16) : "01:00");
    setWokeAt(log.wokeAt ? new Date(log.wokeAt).toISOString().slice(11, 16) : "09:00");
    setNapStart(log.napStart ? new Date(log.napStart).toISOString().slice(11, 16) : "15:00");
    setNapEnd(log.napEnd ? new Date(log.napEnd).toISOString().slice(11, 16) : "15:00");
  };

  const closeTutorial = async (dontShowAgain: boolean) => {
    setShowTutorial(false);

    if (!dontShowAgain || !user?.id || user.tutorialState?.sleep) {
      return;
    }

    const { data } = await api.patch(`/users/${user.id}`, {
      tutorialState: {
        ...user.tutorialState,
        sleep: true,
      },
    });

    updateProfile(data);
  };

  if (isLoading) {
    return (
      <AppLoadingScreen
        title={t("goals.sleep.title")}
        subtitle={t("goals.sleep.subtitle")}
      />
    );
  }

  return (
    <div className="space-y-8">
      <header className="sticky top-4 z-20 border border-neutral-200/50 flex items-center gap-4 bg-white/70 backdrop-blur-sm rounded-3xl p-4 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white/50 rounded-xl transition-colors cursor-pointer hover:text-brand-accent"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="p-2 rounded-lg bg-brand-accent/10 text-brand-accent">
          <BedDouble size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-brand-accent">
            {t("goals.sleep.title")}
          </h1>
          <p className="text-sm text-neutral-500">
            {t("goals.sleep.target")}: {sleepGoal}h
          </p>
        </div>
        <aside className="flex ml-auto gap-4">
          <button onClick={() => navigate("/account", { state: { tab: "goals", section: "sleepGoal" }, })} className="cursor-pointer h-12 w-12 border border-white hover:border-brand-accent hover:text-brand-accent text-zinc-400 rounded-2xl transition-colors">
            <Settings className="w-6 h-6 justify-self-center text-inherit" />
          </button>
          <button onClick={() => setShowTutorial(true)} className="cursor-pointer h-12 w-12 border border-white hover:border-brand-accent hover:text-brand-accent text-zinc-400 rounded-2xl transition-colors">
            <Info className="w-6 h-6 justify-self-center text-inherit" />
          </button>
        </aside>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-4xl border border-neutral-200 bg-white/60 p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                {t("goals.sleep.total_today")}
              </p>
              <h2 className="mt-2 text-5xl font-black text-neutral-900">
                {totalToday.toFixed(1)}h
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                {t("goals.sleep.helper")}
              </p>
            </div>

            <div className="relative h-32 w-32">
              <svg className="h-full w-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-neutral-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="54"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray="339"
                  strokeDashoffset={339 - (339 * progress) / 100}
                  className="text-brand-accent"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-neutral-900">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
                {t("goals.sleep.main_sleep")}
              </p>
              <div className="mt-5 grid gap-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-neutral-700">
                    {t("goals.sleep.main_duration")}
                  </p>
                  <input
                    value={mainDuration}
                    onChange={(event) => {
                      const nextDuration = Number(event.target.value || 0);
                      setMainDuration(event.target.value);
                      setSleptAt(subtractHoursFromTime(wokeAt, nextDuration));
                    }}
                    type="number"
                    step="0.5"
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-3xl font-black outline-none focus:border-brand-accent"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                      <Moon size={14} />
                      <span>{t("goals.sleep.bedtime")}</span>
                    </div>
                    <input
                      value={sleptAt}
                      onChange={(event) => {
                        const value = event.target.value;
                        setSleptAt(value);
                        setMainDuration(String(hoursBetween(value, wokeAt)));
                      }}
                      type="time"
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-xl font-black outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                      <Sunrise size={14} />
                      <span>{t("goals.sleep.wake_time")}</span>
                    </div>
                    <input
                      value={wokeAt}
                      onChange={(event) => {
                        const value = event.target.value;
                        setWokeAt(value);
                        setSleptAt(subtractHoursFromTime(value, Number(mainDuration || 0)));
                      }}
                      type="time"
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-xl font-black outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-neutral-200 bg-white p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
                {t("goals.sleep.nap")}
              </p>
              <div className="mt-5 grid gap-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-neutral-700">
                    {t("goals.sleep.nap_duration")}
                  </p>
                  <input
                    value={napDuration}
                    onChange={(event) => {
                      const nextDuration = Number(event.target.value || 0);
                      setNapDuration(event.target.value);
                      setNapEnd(addHoursToTime(napStart, nextDuration));
                    }}
                    type="number"
                    step="0.5"
                    className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-3xl font-black outline-none focus:border-brand-accent"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                      <Clock3 size={14} />
                      <span>{t("goals.sleep.nap_start")}</span>
                    </div>
                    <input
                      value={napStart}
                      onChange={(event) => {
                        const value = event.target.value;
                        setNapStart(value);
                        setNapEnd(addHoursToTime(value, Number(napDuration || 0)));
                      }}
                      type="time"
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-xl font-black outline-none focus:border-brand-accent"
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-700">
                      <Clock3 size={14} />
                      <span>{t("goals.sleep.nap_end")}</span>
                    </div>
                    <input
                      value={napEnd}
                      onChange={(event) => {
                        const value = event.target.value;
                        setNapEnd(value);
                        setNapDuration(String(hoursBetween(napStart, value)));
                      }}
                      type="time"
                      className="w-full rounded-2xl border border-neutral-200 px-4 py-3 text-xl font-black outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (!editingDateKey && todayLog) {
                setShowOverwriteConfirm(true);
                return;
              }
              saveMutation.mutate();
            }}
            className="mt-6 rounded-2xl bg-neutral-900 px-6 py-4 font-black uppercase tracking-[0.2em] text-white cursor-pointer"
          >
            {saveMutation.isPending ? t("goals.sleep.saving") : t("goals.sleep.save")}
          </button>
        </div>

        <div className="rounded-4xl border border-neutral-200 bg-white/60 p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
            {t("goals.sleep.recent_history")}
          </p>
          <h2 className="mt-2 text-2xl font-black text-neutral-900">
            {t("goals.sleep.average")} {averageSleep}h
          </h2>

          <div className="mt-6 space-y-3">
            {(sleepHistory || []).length === 0 ? (
              <div className="rounded-3xl border border-dashed border-neutral-200 bg-white p-6 text-sm text-neutral-500">
                {t("goals.sleep.no_data")}
              </div>
            ) : (
              (sleepHistory || []).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-3xl border border-neutral-200 bg-white px-4 py-4"
                >
                  <div>
                    <p className="font-bold text-neutral-900">
                      {new Date(`${item.date}`).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {t("goals.sleep.history_total", {
                        hours: Number(item.durationHours).toFixed(1),
                      })}
                    </p>
                  </div>
                  <div className="text-right text-sm text-neutral-500">
                    <p>
                      {item.sleptAt
                        ? new Date(item.sleptAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "--"}{" "}
                      {" -> "}
                      {item.wokeAt
                        ? new Date(item.wokeAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "--"}
                    </p>
                    {"napDurationHours" in item &&
                      Number(item.napDurationHours || 0) > 0 && (
                        <p className="mt-1 text-xs">
                          {t("goals.sleep.history_nap", {
                            hours: Number(item.napDurationHours || 0).toFixed(1),
                          })}
                        </p>
                      )}
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        onClick={() =>
                          hydrateFormFromLog(
                            item,
                            String(item.date).slice(0, 10),
                          )
                        }
                        className="cursor-pointer rounded-2xl border border-neutral-200 bg-neutral-50 p-2 text-brand-accent"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(item.id)}
                        disabled={deleteMutation.isPending}
                        className="cursor-pointer rounded-2xl border border-neutral-200 bg-neutral-50 p-2 text-red-500"
                      >
                        {deleteMutation.isPending ? (
                          <CustomLoadingSpinner className="h-3.5 w-3.5" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {showOverwriteConfirm ? (
        <div className="fixed inset-0 z-140 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-4xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-black text-neutral-900">
              {t("goals.sleep.overwrite_title")}
            </h3>
            <p className="mt-3 text-sm text-neutral-500">
              {t("goals.sleep.overwrite_description")}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowOverwriteConfirm(false)}
                className="cursor-pointer rounded-2xl border border-neutral-200 px-4 py-3 font-bold text-neutral-600"
              >
                {t("goals.sleep.cancel")}
              </button>
              <button
                onClick={() => saveMutation.mutate()}
                className="cursor-pointer rounded-2xl bg-neutral-900 px-4 py-3 font-black uppercase tracking-[0.12em] text-white"
              >
                {saveMutation.isPending ? t("goals.sleep.saving") : t("goals.sleep.confirm_overwrite")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showTutorial && (
        <FeatureTutorialModal
          title={t("tutorials.sleep.title")}
          subtitle={t("tutorials.sleep.subtitle")}
          closeLabel={t("tutorials.close")}
          dontShowAgainLabel={t("tutorials.do_not_show_again")}
          steps={[
            {
              title: t("tutorials.sleep.steps.duration.title"),
              description: t("tutorials.sleep.steps.duration.description"),
            },
            {
              title: t("tutorials.sleep.steps.automatic.title"),
              description: t("tutorials.sleep.steps.automatic.description"),
            },
            {
              title: t("tutorials.sleep.steps.nap.title"),
              description: t("tutorials.sleep.steps.nap.description"),
            },
            {
              title: t("tutorials.sleep.steps.history.title"),
              description: t("tutorials.sleep.steps.history.description"),
            },
          ]}
          onContinue={closeTutorial}
        />
      )}
    </div>
  );
};

export default SleepGoal;
