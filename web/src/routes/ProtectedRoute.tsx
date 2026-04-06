import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { api } from "../services/api";
import AppLoadingScreen from "../components/AppLoadingScreen";
import {
  DEFAULT_WORKOUT_PRESETS,
  useWorkoutStore,
} from "../store/goals/workoutStore";

export const ProtectedRoute = () => {
  const { user, token, _hasHydrated, updateProfile } = useAuthStore();
  const location = useLocation();
  const setFullState = useWorkoutStore((state) => state.setFullState);
  const canBootstrap = _hasHydrated && Boolean(token);

  const todayKey = new Date().toISOString().slice(0, 10);
  const bootstrapQueries = useQueries({
    queries: [
      {
        queryKey: ["me"],
        queryFn: async () => {
          const { data } = await api.get("/users/me");
          return data;
        },
        enabled: canBootstrap,
      },
      {
        queryKey: ["workoutSettings"],
        queryFn: async () => {
          const { data } = await api.get("/workouts/settings");
          return data;
        },
        enabled: canBootstrap,
      },
      {
        queryKey: ["workoutPresets"],
        queryFn: async () => {
          const { data } = await api.get("/workouts/presets");
          return data;
        },
        enabled: canBootstrap,
      },
      {
        queryKey: ["water-today"],
        queryFn: async () => {
          const { data } = await api.get("/water/today");
          return data;
        },
        enabled: canBootstrap,
      },
      {
        queryKey: ["meals-log", todayKey],
        queryFn: async () => {
          const { data } = await api.get(`/meals/log?date=${todayKey}`);
          return data;
        },
        enabled: canBootstrap,
      },
      {
        queryKey: ["workout-log", todayKey],
        queryFn: async () => {
          const { data } = await api.get(`/workouts/today?date=${todayKey}`);
          return data;
        },
        enabled: canBootstrap,
      },
    ],
  });

  const [meQuery, workoutSettingsQuery, workoutPresetsQuery] = bootstrapQueries;
  const isBootstrapping = bootstrapQueries.some((query) => query.isLoading);

  useEffect(() => {
    if (meQuery.data) {
      updateProfile(meQuery.data);
    }
  }, [meQuery.data, updateProfile]);

  useEffect(() => {
    if (!workoutSettingsQuery.data && !workoutPresetsQuery.data) return;

    const customPresets = Array.isArray(workoutPresetsQuery.data)
      ? workoutPresetsQuery.data
      : [];

    const serverState =
      workoutSettingsQuery.data && typeof workoutSettingsQuery.data === "object"
        ? workoutSettingsQuery.data
        : null;

    setFullState({
      cycle: serverState?.cycle || [],
      startDate: serverState?.startDate || new Date().toISOString(),
      history: serverState?.history || [],
      logs: serverState?.logs || [],
      summaries: serverState?.summaries || [],
      presets: [...DEFAULT_WORKOUT_PRESETS, ...customPresets],
    });
  }, [setFullState, workoutPresetsQuery.data, workoutSettingsQuery.data]);

  if (!_hasHydrated)
    return <AppLoadingScreen fullScreen title="Entrando" subtitle="Preparando seu espaco..." />;

  if (!token) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (user && !user.isProfileComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  if (isBootstrapping) {
    return (
      <AppLoadingScreen
        fullScreen
        title="Sincronizando"
        subtitle="Carregando dashboard, treino, agua e refeicoes..."
      />
    );
  }

  return <Outlet />;
};
