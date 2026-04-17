import React from "react";
import { LifeBuoy, Send } from "lucide-react";
// @ts-expect-error
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useAccountUnsavedChanges } from "./AccountUnsavedChangesContext";

type HelpFormData = {
  subject: string;
  message: string;
};

const Help: React.FC = () => {
  const { t, lang } = useSettingsStore();
  const { user } = useAuthStore();
  const { setHasUnsavedChanges } = useAccountUnsavedChanges();
  const { register, handleSubmit, reset, watch, formState: { isDirty }, setValue } = useForm<HelpFormData>({
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const subjectValue = watch("subject");
  const messageValue = watch("message");
  const isFormInvalid = !subjectValue?.trim() || !messageValue?.trim();

  React.useEffect(() => {
    setHasUnsavedChanges(isDirty);
    return () => setHasUnsavedChanges(false);
  }, [isDirty, setHasUnsavedChanges, watch]);

  const sendMutation = useMutation({
    mutationFn: async (data: HelpFormData) => {
      const response = await api.post(`/users/${user?.id}/help-report`, { ...data, lang });
      return response.data;
    },
    onSuccess: () => {
      reset();
      setHasUnsavedChanges(false);
    },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">{t("account.help.title")}</h2>
          <p className="text-sm text-neutral-500">{t("account.help.subtitle")}</p>
        </div>
        <LifeBuoy className="text-neutral-300" size={30} />
      </div>

      <form
        onSubmit={handleSubmit(async (data: HelpFormData) => sendMutation.mutateAsync(data))}
        className="max-w-2xl space-y-5"
      >
        <div className="rounded-3xl border border-neutral-200 bg-white/60 p-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-neutral-800">
              {t("account.help.subject")}
            </label>
            <input
              {...register("subject")}
              onBlur={(e) => {
                register("subject").onBlur(e);
                setValue("subject", e.target.value.trim(), { shouldValidate: true, shouldDirty: true });
              }}
              maxLength={70}
              className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 outline-none transition-all focus:border-brand-accent"
              placeholder={t("account.help.subject_placeholder")}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-neutral-800">
              {t("account.help.message")}
            </label>
            <textarea
              {...register("message")}
              onBlur={(e) => {
                register("message").onBlur(e);
                setValue("message", e.target.value.trim(), { shouldValidate: true, shouldDirty: true });
              }}
              rows={6}
              className="w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 outline-none transition-all focus:border-brand-accent"
              placeholder={t("account.help.message_placeholder")}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={sendMutation.isPending || isFormInvalid}
          className="flex w-fit items-center gap-2 rounded-xl bg-neutral-900 px-8 py-3 font-bold text-white transition-all disabled:cursor-not-allowed enabled:hover:bg-brand-accent disabled:opacity-60 cursor-pointer group"
        >
          <Send
            size={18}
            className="group-enabled:group-hover:scale-110 transition-transform"
          />
          {sendMutation.isPending ? t("account.help.sending") : t("account.help.send")}
        </button>
      </form>
    </div>
  );
};

export default Help;



