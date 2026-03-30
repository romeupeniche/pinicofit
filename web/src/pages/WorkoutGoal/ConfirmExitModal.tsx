import React from "react";
import { useNavigationLock } from "../../hooks/useNavigationLock";
import { AlertTriangle } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";

interface ConfirmExitModalProps {
  hasChanges: boolean;
  isLoading: boolean;
  rollbackChanges: () => void;
  manualClose?: () => void;
  manualConfirm?: () => void;
}

const ConfirmExitModal: React.FC<ConfirmExitModalProps> = ({
  hasChanges,
  isLoading,
  rollbackChanges,
  manualClose,
  manualConfirm,
}) => {
  const blocker = useNavigationLock({ hasChanges, isLoading });
  const { t } = useSettingsStore();

  const isOpen = blocker.state === "blocked" || !!manualClose;

  if (!isOpen) return null;

  const handleProceed = () => {
    if (isLoading) return;
    if (manualConfirm) {
      manualConfirm();
    } else {
      blocker.proceed?.();
      rollbackChanges();
    }
  };

  const handleCancel = () => {
    if (manualClose) {
      manualClose();
    } else {
      blocker.reset?.();
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-999 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} className="text-red-500" />
          </div>

          <h3 className="text-2xl font-black text-neutral-900 mb-2 tracking-tight">
            {t("goals.workout.plan_window.confirm_exit_modal.title")}
          </h3>

          <p className="text-neutral-500 font-medium mb-8 leading-relaxed">
            {t("goals.workout.plan_window.confirm_exit_modal.subtitle")}
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              disabled={isLoading}
              onClick={handleProceed}
              className={`w-full py-4 font-black rounded-2xl transition-colors ${
                isLoading
                  ? "bg-neutral-300 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white cursor-pointer"
              }`}
            >
              {isLoading
                ? t("goals.workout.plan_window.saving")
                : t(
                    "goals.workout.plan_window.confirm_exit_modal.actions.discard",
                  )}
            </button>

            <button
              onClick={handleCancel}
              className="w-full py-4 cursor-pointer bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-2xl font-black transition-colors"
            >
              {t("goals.workout.plan_window.confirm_exit_modal.actions.cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmExitModal;
