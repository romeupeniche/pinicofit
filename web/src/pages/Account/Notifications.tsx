import React from "react";
import { Bell, CheckCircle2, Mail, Save } from "lucide-react";
// @ts-expect-error
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { api } from "../../services/api";
import { useSettingsStore } from "../../store/settingsStore";
import { useSearchParams } from "react-router-dom";
import { useAccountUnsavedChanges } from "./AccountUnsavedChangesContext";

type NotificationFormData = {
  notificationsEmail: string;
  emailAlertsEnabled: boolean;
  emailReportsEnabled: boolean;
};

const Notifications: React.FC = () => {
  const { t, lang } = useSettingsStore();
  const { user, updateProfile } = useAuthStore();
  const { setHasUnsavedChanges } = useAccountUnsavedChanges();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<NotificationFormData>({
    defaultValues: {
      notificationsEmail: user?.notificationsEmail || user?.email || "",
      emailAlertsEnabled: user?.emailAlertsEnabled ?? true,
      emailReportsEnabled: user?.emailReportsEnabled ?? false,
    },
  });

  React.useEffect(() => {
    setHasUnsavedChanges(isDirty);
    return () => setHasUnsavedChanges(false);
  }, [isDirty, setHasUnsavedChanges]);

  const saveMutation = useMutation({
    mutationFn: async (data: NotificationFormData) => {
      const needsReverify =
        (data.notificationsEmail || "").trim() !==
        (user?.notificationsEmail || user?.email || "").trim();
      const response = await api.patch(`/users/${user?.id}`, {
        ...data,
        isEmailVerified: needsReverify ? false : user?.isEmailVerified,
      });
      return response.data;
    },
    onSuccess: (data) => {
      updateProfile(data);
      reset({
        notificationsEmail: data?.notificationsEmail || data?.email || "",
        emailAlertsEnabled: data?.emailAlertsEnabled ?? true,
        emailReportsEnabled: data?.emailReportsEnabled ?? false,
      });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setHasUnsavedChanges(false);
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(
        `/users/${user?.id}/notifications/send-verification`,
        { lang },
      );
      return response.data;
    },
  });

  const reportMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/users/${user?.id}/notifications/test-report`, {
        lang,
        recipientEmail: user?.notificationsEmail || user?.email,
        recipientName: user?.name,
      });
      return response.data;
    },
  });

  React.useEffect(() => {
    const token = searchParams.get("verifyEmailToken");
    if (!token || !user?.id) return;

    api
      .get(`/users/verify-email?token=${token}`)
      .then(({ data }) => {
        updateProfile(data);
        queryClient.invalidateQueries({ queryKey: ["me"] });
        searchParams.delete("verifyEmailToken");
        setSearchParams(searchParams, { replace: true });
      })
      .catch(() => {
        searchParams.delete("verifyEmailToken");
        setSearchParams(searchParams, { replace: true });
      });
  }, [queryClient, searchParams, setSearchParams, updateProfile, user?.id]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">
            {t("account.notifications.title")}
          </h2>
          <p className="text-sm text-neutral-500">
            {t("account.notifications.subtitle")}
          </p>
        </div>
        <Bell className="text-neutral-300" size={30} />
      </div>

      <form
        onSubmit={handleSubmit(async (data: NotificationFormData) =>
          saveMutation.mutateAsync(data),
        )}
        className="max-w-2xl space-y-6"
      >
        <div className="rounded-3xl border border-neutral-200 bg-white/60 p-6">
          <div className="flex flex-col-reverse items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-neutral-800 flex items-center gap-2">
                <Mail size={16} className="text-brand-accent" />
                {t("account.notifications.email_label")}
              </p>
              <p className="text-sm text-neutral-500 mt-1">
                {t("account.notifications.email_hint")}
              </p>
            </div>
            {user?.isEmailVerified ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-600">
                <CheckCircle2 size={14} />
                {t("account.notifications.verified")}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => verifyMutation.mutate()}
                disabled={
                  isDirty || !watch("notificationsEmail")?.trim() || saveMutation.isPending
                }
                className="cursor-pointer rounded-full bg-brand-accent/10 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-brand-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDirty
                  ? t("account.notifications.save_before_verify")
                  : verifyMutation.isPending
                    ? t("account.notifications.verifying")
                    : t("account.notifications.verify")}
              </button>
            )}
          </div>

          <input
            type="email"
            {...register("notificationsEmail")}
            className="mt-4 w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-white focus:border-brand-accent outline-none transition-all"
          />
        </div>

        <div className="grid gap-4">
          <label className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white/50 px-4 py-4">
            <div>
              <p className="font-bold text-neutral-800">
                {t("account.notifications.alerts")}
              </p>
              <p className="text-sm text-neutral-500">
                {t("account.notifications.alerts_hint")}
              </p>
            </div>
            <input type="checkbox" {...register("emailAlertsEnabled")} className="h-5 w-5 accent-brand-accent" />
          </label>

          <label className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white/50 px-4 py-4">
            <div>
              <p className="font-bold text-neutral-800">
                {t("account.notifications.reports")}
              </p>
              <p className="text-sm text-neutral-500">
                {t("account.notifications.reports_hint")}
              </p>
            </div>
            <input type="checkbox" {...register("emailReportsEnabled")} className="h-5 w-5 accent-brand-accent" />
          </label>
        </div>

        <button
          type="submit"
          disabled={saveMutation.isPending || !isDirty}
          className="w-fit px-8 py-3 bg-neutral-900 disabled:opacity-50 text-white rounded-xl font-bold enabled:hover:bg-brand-accent transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-2 group"
        >
          <Save
            size={18}
            className="group-enabled:group-hover:scale-110 transition-transform"
          />
          {saveMutation.isPending
            ? t("account.notifications.saving")
            : t("account.save_updates")}
        </button>

        <button
          type="button"
          onClick={() => reportMutation.mutate()}
          className="ml-3 w-fit px-8 py-3 bg-white text-neutral-900 rounded-xl font-bold border border-neutral-200 hover:border-brand-accent transition-all cursor-pointer"
        >
          {reportMutation.isPending ? t("account.notifications.sending_report") : t("account.notifications.test_report")}
        </button>
      </form>
    </div>
  );
};

export default Notifications;



