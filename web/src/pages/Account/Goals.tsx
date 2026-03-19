import React from "react";
import { Save, Activity } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";

const Goals: React.FC = () => {
  const { t } = useSettingsStore();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Minhas Metas Diárias</h2>
        <Activity className="text-neutral-300" size={30} />
      </div>

      <div className="grid gap-8 max-w-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Meta de Água (ml)
            </label>
            <input
              type="number"
              defaultValue={3000}
              placeholder="Ex: 3000"
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Meta de Sono (horas)
            </label>
            <input
              type="number"
              step="0.5"
              defaultValue={8}
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">
            Nutrição & Macros
          </h3>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Calorias Totais (kcal)
            </label>
            <input
              type="number"
              defaultValue={2500}
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-2">
                Proteína (g)
              </label>
              <input
                type="number"
                defaultValue={180}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-2">
                Carbos (g)
              </label>
              <input
                type="number"
                defaultValue={250}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-2">
                Gordura (g)
              </label>
              <input
                type="number"
                defaultValue={70}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Frequência de Treinos (dias/semana)
          </label>
          <select className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all cursor-pointer">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <option key={d} value={d}>
                {d} dias por semana
              </option>
            ))}
          </select>
        </div>

        <button className="w-fit mt-4 px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-brand-accent transition-all cursor-pointer flex items-center gap-2 group">
          <Save
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          {t("account.profile.save_updates")}
        </button>
      </div>
    </div>
  );
};

export default Goals;
