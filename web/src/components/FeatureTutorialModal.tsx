import React from "react";
import { CheckCircle2, Sparkles } from "lucide-react";

interface TutorialStep {
  title: string;
  description: string;
}

interface FeatureTutorialModalProps {
  title: string;
  subtitle: string;
  steps: TutorialStep[];
  onClose: () => void;
  closeLabel: string;
}

const FeatureTutorialModal: React.FC<FeatureTutorialModalProps> = ({
  title,
  subtitle,
  steps,
  onClose,
  closeLabel,
}) => {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-3xl rounded-[2rem] border border-white/10 bg-neutral-950 text-white shadow-2xl overflow-hidden">
        <div className="bg-brand-accent/10 border-b border-white/10 px-8 py-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-accent flex items-center gap-2">
            <Sparkles size={14} />
            Tutorial
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm text-neutral-300">{subtitle}</p>
        </div>

        <div className="grid gap-4 px-8 py-8 md:grid-cols-2">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <p className="text-sm font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-brand-accent" />
                {step.title}
              </p>
              <p className="mt-2 text-sm text-neutral-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="px-8 pb-8">
          <button
            onClick={onClose}
            className="w-full cursor-pointer rounded-2xl bg-brand-accent py-4 text-sm font-black uppercase tracking-[0.2em] text-black transition-transform active:scale-[0.98]"
          >
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureTutorialModal;
