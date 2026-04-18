import { Activity } from 'lucide-react';
import React from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { formatTextWithHighlights } from '../utils/formatTextWithHighlights';

type TModalType = "disable_goal" | "reactivate_goal" | "cooldown_active"

interface GoalsConfirmSettingModalProps {
    modalType: TModalType,
    setIsModalOpen: React.Dispatch<React.SetStateAction<TModalType | null>>,
    onConfirm: () => void,
    cooldownDays: number
}

const GoalsConfirmSettingModal: React.FC<GoalsConfirmSettingModalProps> = ({ modalType, setIsModalOpen, onConfirm, cooldownDays }) => {
    const { t } = useSettingsStore();
    const red = modalType === "disable_goal" || modalType === "cooldown_active";

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
                onClick={() => setIsModalOpen(null)}
            />

            <div className="relative bg-white w-full max-w-sm rounded-4xl p-8 shadow-2xl border border-neutral-100 scale-in-center">
                <div className="flex flex-col items-center text-center">
                    <div className={`p-4 ${red ? "text-red-500 bg-red-50" : "text-brand-accent bg-brand-accent/10"} rounded-2xl mb-4`}>
                        <Activity size={32} />
                    </div>

                    <h3 className="text-xl font-black text-neutral-800 mb-2">
                        {t(`account.goals.${modalType}.title`)}
                    </h3>

                    <p className="text-sm text-neutral-500 leading-relaxed mb-8">
                        {formatTextWithHighlights(t(`account.goals.${modalType}.description`, { days: String(cooldownDays) }), "text-red-500")}
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={onConfirm}
                            className={`cursor-pointer w-full py-4 ${red ? "bg-red-500 hover:bg-red-600" : "bg-brand-accent/90 hover:bg-brand-accent"} text-white rounded-2xl font-bold transition-all`}
                        >
                            {t(`account.goals.${modalType}.confirm`)}
                        </button>
                        {!(modalType === "cooldown_active") && (
                            <button
                                onClick={() => setIsModalOpen(null)}
                                className="cursor-pointer w-full py-4 bg-neutral-100 text-neutral-600 rounded-2xl font-bold hover:bg-neutral-200 transition-all"
                            >
                                {t(`account.goals.${modalType}.cancel`)}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GoalsConfirmSettingModal;