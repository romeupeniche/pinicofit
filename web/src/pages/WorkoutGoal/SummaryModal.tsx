import { useRef, useState, useMemo } from "react";
import {
  X,
  Download,
  Flame,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { format, parseISO } from "date-fns";
import type { Summary } from "../../utils/processPendingSummaries";
import { useSettingsStore } from "../../store/settingsStore";
import {
  EXERCISE_CATEGORIES,
  type ExerciseCategory,
} from "../../constants/workout-metrics";
import { useAuthStore } from "../../store/authStore";
import type { ExerciseStatus } from "../../store/goals/workoutStore";
import MUSCLE_QUOTES from "../../constants/muscle-quotes";
import { KG_TO_LBS_RATIO } from "../../utils/weightUnitConverter";

const THEMES = [
  {
    id: "dark",
    bg: "#080808",
    accent: "#AA3BFF",
    text: "#FFFFFF",
    muted: "#525252",
  },
  {
    id: "light",
    bg: "#F5F5F5",
    accent: "#2563EB",
    text: "#0F172A",
    muted: "#94A3B8",
  },
  {
    id: "ghost",
    bg: "transparent",
    accent: "#fff",
    text: "#FFFFFF",
    muted: "rgba(255,255,255,0.4)",
  },
  {
    id: "fire",
    bg: "#1a0505",
    accent: "#FF4500",
    text: "#FFFFFF",
    muted: "#631c1c",
  },
];

const SummaryModal = ({
  summary,
  onClose,
  workoutLength,
}: {
  summary?: Summary;
  onClose: () => void;
  workoutLength: number;
}) => {
  const shareRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);
  const { t, lang, weightUnit } = useSettingsStore();
  const { user } = useAuthStore();
  const currentTheme = THEMES[themeIndex];

  const nextTheme = () => setThemeIndex((prev) => (prev + 1) % THEMES.length);

  const stats = useMemo(() => {
    if (!summary?.exercises) return null;
    let increasedCount = 0;
    let doneCount = 0;
    let failedCount = 0;
    let totalRepsCount = 0;
    let totalPlannedTonnage = 0;
    let totalActualTonnage = 0;

    const isLbs = weightUnit === "lbs";
    const factor = isLbs ? KG_TO_LBS_RATIO : 1;
    const unitLabel = isLbs ? "lb" : "kg";

    const missingCount = Math.max(0, workoutLength - summary.exercises.length);
    const counts: Record<
      string,
      { count: number; group: string; category: string }
    > = {};

    summary.exercises.forEach((ex) => {
      if (ex.status === "increased") increasedCount++;
      else if (ex.status === "done") doneCount++;
      else if (ex.status === "failed") failedCount++;

      const sets = Number(ex.sets) || 0;
      const repsPerSet = Number(ex.reps) || 0;
      totalRepsCount += sets * repsPerSet;

      if (ex.status === "increased" && ex.weight && ex.actualWeight) {
        totalPlannedTonnage += Number(ex.weight) * sets * repsPerSet;
        totalActualTonnage += Number(ex.actualWeight) * sets * repsPerSet;
      }

      const categoryKey = ex.category;
      const uniqueKey = `${ex.group}-${categoryKey}`;
      if (!counts[uniqueKey]) {
        counts[uniqueKey] = {
          count: 0,
          group: ex.group,
          category: categoryKey,
        };
      }
      counts[uniqueKey].count += 1;
    });

    const sortedGroups = Object.entries(counts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 3)
      .map(([, data]) => {
        const label =
          EXERCISE_CATEGORIES[data.group as ExerciseCategory]?.label ||
          data.group;
        const translatedName = t(label).split(" (")[0];
        const suffix = data.group.toLowerCase().split("_")[1] || "";
        const typeLetter = suffix.startsWith("c")
          ? "C"
          : suffix.startsWith("i")
            ? "I"
            : "";
        return `${translatedName}${typeLetter ? ` (${typeLetter})` : ""}`;
      });

    const topEntry = Object.entries(counts).sort(
      (a, b) => b[1].count - a[1].count,
    )[0];
    const mainGroupId = topEntry
      ? topEntry[1].group.split("_")[0].toLowerCase()
      : "default";
    const quotes = MUSCLE_QUOTES[mainGroupId] || MUSCLE_QUOTES.default;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)][lang];
    const durationInMinutes = summary.duration || 1;

    const loadDensity = Math.round(
      (summary.tonnage * factor) / durationInMinutes,
    );
    const loadPerRep =
      totalRepsCount > 0
        ? ((summary.tonnage * factor) / totalRepsCount).toFixed(1)
        : "0";
    const progressionDiff = (totalActualTonnage - totalPlannedTonnage) * factor;
    const convertedTonnage = summary.tonnage * factor;

    const loadProgression =
      totalPlannedTonnage > 0
        ? (
          ((totalActualTonnage - totalPlannedTonnage) / totalPlannedTonnage) *
          100
        ).toFixed(1)
        : "0";

    return {
      sortedGroups,
      randomQuote,
      loadDensity,
      loadPerRep,
      loadProgression,
      progressionDiff,
      convertedTonnage,
      unitLabel,
      mainGroup: mainGroupId,
      statusCounts: {
        increased: increasedCount,
        done: doneCount,
        failed: failedCount + missingCount,
      },
    };
  }, [summary, t, workoutLength, lang, weightUnit]);

  const exportImage = async () => {
    const originalNode = shareRef.current;
    if (!originalNode) return;

    setLoading(true);

    try {
      const dataUrl = await toPng(originalNode, {
        width: 1080,
        height: 1920,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          left: "0",
          top: "0",
          position: "static",
        },
        pixelRatio: 1,
        backgroundColor:
          currentTheme.id === "ghost" ? "transparent" : currentTheme.bg,
      });

      saveAs(dataUrl, `pinicofit-${format(new Date(), "dd-MM")}.png`);
    } catch (err) {
      console.error("Erro na exportação:", err);
      alert("Erro ao gerar imagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!stats || !summary) return null;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center bg-black/95 backdrop-blur-xl overflow-hidden p-4">
      <div className="flex fixed bottom-8 left-1/2 -translate-x-1/2 z-130 items-center gap-3 bg-neutral-900/90 p-3 rounded-2xl border border-white/10 shadow-2xl">
        <button
          onClick={nextTheme}
          className="cursor-pointer hover:scale-105 transition-transform duration-200 border-2 border-white/20 rounded-xl overflow-hidden group"
          title={t("goals.workout.summary_modal.change_theme")}
          style={{ width: "36px", height: "36px" }}
        >
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            {currentTheme.id === "ghost" ? (
              <div
                className="w-full h-full"
                style={{
                  backgroundColor: "#ffffff",
                  backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%), 
            linear-gradient(-45deg, #ccc 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, #ccc 75%), 
            linear-gradient(-45deg, transparent 75%, #ccc 75%)
          `,
                  backgroundSize: "10px 10px",
                  backgroundPosition: "0 0, 0 5px, 5px 5px, 5px 0",
                }}
              />
            ) : (
              <div
                className="w-full h-full"
                style={{ backgroundColor: currentTheme.bg }}
              />
            )}

            <div className="absolute inset-0 not-first-of-type:bg-linear-to-tr from-black/20 to-white/12 pointer-events-none" />
          </div>
        </button>
        <button
          onClick={exportImage}
          disabled={loading}
          className="cursor-pointer px-6 py-3 bg-purple-600 text-white rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2"
        >
          {loading ? (
            t("goals.workout.summary_modal.saving")
          ) : (
            <>
              <Download size={18} /> {t("goals.workout.summary_modal.share")}
            </>
          )}
        </button>
        <button
          onClick={onClose}
          className="cursor-pointer p-3 text-red-400 hover:bg-red-400/10 rounded-xl"
        >
          <X size={20} />
        </button>
      </div>

      <div
        style={{
          width: "360px",
          height: "640px",
          position: "relative",
          background: currentTheme.bg,
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(0,0,0,0.5)",
        }}
      >
        <div
          ref={shareRef}
          id="story-to-print"
          style={{
            width: "1080px",
            height: "1920px",
            backgroundColor: currentTheme.bg,
            display: "flex",
            flexDirection: "column",
            padding: "90px 90px 20px 90px",
            position: "absolute",
            top: 0,
            left: 0,
            transform: "scale(0.3333)",
            transformOrigin: "top left",
          }}
        >
          {currentTheme.id === "fire" && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "radial-gradient(circle at bottom, #ff450033 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
          )}

          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div style={{ display: "flex" }}>
                <Flame size={100} color={currentTheme.accent} />
                <span
                  style={{
                    color: currentTheme.accent,
                    fontSize: "30px",
                    fontWeight: 900,
                    marginLeft: "-20px",
                  }}
                >
                  238
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    color: currentTheme.muted,
                    fontSize: "35px",
                    fontWeight: 800,
                    margin: 0,
                  }}
                >
                  {format(parseISO(summary.date), "dd MMM yyyy")}
                </p>
                <p
                  style={{
                    color: currentTheme.accent,
                    fontSize: "25px",
                    fontWeight: 900,
                  }}
                >
                  {user?.name || "Athlete"}
                </p>
              </div>
            </div>
            <p
              style={{
                color: currentTheme.text,
                fontSize: "45px",
                fontWeight: 800,
                margin: "10px 0",
                letterSpacing: "4px",
              }}
            >
              {summary.workoutName}
            </p>
          </header>

          <main style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ marginTop: "120px" }}>
                <span
                  style={{
                    color: currentTheme.muted,
                    fontSize: "40px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "5px",
                  }}
                >
                  {t("goals.workout.summary_modal.total_volume")}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                  }}
                >
                  <h2
                    style={{
                      color: currentTheme.text,
                      fontSize: "400px",
                      fontWeight: 900,
                      fontStyle: "italic",
                      display: "flex",
                      alignItems: "baseline",
                      margin: 0,
                    }}
                  >
                    <span style={{ lineHeight: "1", display: "inline-block" }}>
                      {Math.floor(stats.convertedTonnage / 1000)}
                    </span>
                    <span
                      style={{
                        fontSize: "100px",
                        color: currentTheme.accent,
                        lineHeight: "1",
                      }}
                    >
                      .
                    </span>
                    <span style={{ lineHeight: "1", display: "inline-block" }}>
                      {(Math.floor(stats.convertedTonnage) % 1000)
                        .toString()
                        .substring(0, 1)}
                    </span>
                  </h2>
                  <span
                    style={{
                      color: currentTheme.accent,
                      fontSize: "120px",
                      fontWeight: 900,
                      marginLeft: "20px",
                    }}
                  >
                    {weightUnit === "lbs" ? "kLB" : "T"}
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginTop: "100px",
              }}
            >
              <div>
                <span
                  style={{
                    color: currentTheme.muted,
                    fontSize: "30px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  {t("goals.workout.summary_modal.calories_burned")}
                </span>
                <p
                  style={{
                    color: currentTheme.text,
                    fontSize: "70px",
                    fontWeight: 900,
                    margin: "10px 0",
                  }}
                >
                  {summary.calories.toFixed(0)}{" "}
                  <small
                    style={{ color: currentTheme.accent, fontSize: "30px" }}
                  >
                    KCAL
                  </small>
                </p>
              </div>
              <div>
                <span
                  style={{
                    color: currentTheme.muted,
                    fontSize: "30px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                  }}
                >
                  {t("goals.workout.summary_modal.intensity")}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                  }}
                >
                  <p
                    style={{
                      color: currentTheme.text,
                      fontSize: "70px",
                      fontWeight: 900,
                      margin: "10px 0",
                    }}
                  >
                    {summary.exercises.length}
                  </p>
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      fontWeight: 900,
                    }}
                  >
                    <small
                      style={{ color: currentTheme.muted, fontSize: "25px" }}
                    >
                      /{workoutLength}
                    </small>
                    <small
                      style={{ color: currentTheme.accent, fontSize: "30px" }}
                    >
                      {t("goals.workout.summary_modal.exercises_abrev")}
                    </small>
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "80px",
                display: "flex",
                alignItems: "flex-start",
                gap: "40px",
              }}
            >
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  height: "235px",
                }}
              >
                <span
                  style={{
                    color: currentTheme.muted,
                    fontSize: "30px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    marginBottom: "10px",
                  }}
                >
                  {t("goals.workout.summary_modal.workout_focus")}
                </span>
                {stats.sortedGroups.map((groupName, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <span
                      style={{
                        color: currentTheme.accent,
                        fontSize: "40px",
                        fontWeight: 900,
                        fontStyle: "italic",
                        width: "50px",
                      }}
                    >
                      {index + 1}.
                    </span>
                    <span
                      style={{
                        color: currentTheme.text,
                        fontSize: "36px",
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        flex: 1,
                      }}
                    >
                      {groupName}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column",
                  height: "235px",
                  overflow: "hidden",
                  alignItems: "flex-end",
                }}
              >
                <span
                  style={{
                    color: currentTheme.muted,
                    fontSize: "30px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    marginBottom: "10px",
                  }}
                >
                  {t("goals.workout.summary_modal.general_performance")}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    paddingLeft: "40px",
                  }}
                >
                  <div>
                    {[
                      {
                        label: `${stats.unitLabel}/min`,
                        value: stats.loadDensity,
                      },
                      {
                        label: `${stats.unitLabel}/rep`,
                        value: stats.loadPerRep,
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <h3
                          style={{
                            color: currentTheme.accent,
                            fontSize: "60px",
                          }}
                        >
                          {value}
                        </h3>
                        <span
                          style={{
                            color: currentTheme.muted,
                            fontSize: "30px",
                            marginTop: "-20px",
                            marginLeft: "5px",
                          }}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    {["increased", "done", "failed"].map((status, index) => {
                      const iconColor =
                        status === "increased"
                          ? "#3b82f6"
                          : status === "done"
                            ? "#22c55e"
                            : "#ef4444";
                      return (
                        <div
                          key={index}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <span
                            style={{
                              color: currentTheme.accent,
                              fontSize: "40px",
                              fontWeight: 900,
                              fontStyle: "italic",
                              width: "50px",
                            }}
                          >
                            {stats.statusCounts[status as ExerciseStatus]}
                          </span>
                          {status === "increased" ? (
                            <TrendingUp size={50} color={iconColor} />
                          ) : status === "done" ? (
                            <CheckCircle2 size={50} color={iconColor} />
                          ) : (
                            <AlertTriangle size={50} color={iconColor} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "0 15px",
                borderRadius: "12px",
                margin:
                  stats.statusCounts.increased > 0
                    ? "50px auto 0 auto"
                    : "0 auto 0 auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: stats.statusCounts.increased > 0 ? "700px" : "900px",
              }}
            >
              {stats.statusCounts.increased === 0 && (
                <span
                  style={{
                    fontSize: "150px",
                    opacity: 0.3,
                    height: "100px",
                    color: currentTheme.accent,
                    fontStyle: "italic",
                    fontWeight: 900,
                  }}
                >
                  "
                </span>
              )}
              {stats.statusCounts.increased > 0 ? (
                <>
                  <p
                    style={{
                      color: currentTheme.accent,
                      fontSize: "60px",
                      fontWeight: "800",
                      marginBottom: "5px",
                    }}
                  >
                    🚀 +{stats.loadProgression}%
                  </p>
                  <p
                    style={{
                      color: currentTheme.text,
                      fontSize: "44px",
                      opacity: 0.9,
                      textAlign: "center",
                    }}
                  >
                    {t("goals.workout.summary_modal.surpassed_plan.0")}
                    <span
                      style={{ fontWeight: "bold", color: currentTheme.accent }}
                    >
                      {stats.progressionDiff.toFixed(0)}
                      {stats.unitLabel}
                    </span>
                    {t("goals.workout.summary_modal.surpassed_plan.1")}
                  </p>
                </>
              ) : (
                <p
                  style={{
                    color: currentTheme.text,
                    fontSize: "65px",
                    fontWeight: 800,
                    fontStyle: "italic",
                    lineHeight: 1.3,
                    textAlign: "center",
                  }}
                >
                  {stats.randomQuote}
                </p>
              )}
            </div>
          </main>

          <footer
            style={{
              textAlign: "center",
              padding: "20px",
            }}
          >
            <p
              style={{
                color: currentTheme.muted,
                fontSize: "28px",
                fontWeight: 900,
                letterSpacing: "12px",
                textTransform: "uppercase",
              }}
            >
              PINICOFIT
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
