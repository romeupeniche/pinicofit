import React, { memo } from "react";
import {
  //   User,
  Settings,
  Globe,
  Bell,
  ShieldCheck,
  LogOut,
  Camera,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";

interface SettingsRowProps {
  icon: LucideIcon;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  icon: Icon,
  label,
  value,
  onClick,
  danger,
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-white/10 transition-all rounded-2xl group"
  >
    <div className="flex items-center gap-4">
      <div
        className={`p-2 rounded-xl ${danger ? "bg-red-500/10 text-red-500" : "bg-brand-accent/10 text-brand-accent"}`}
      >
        <Icon size={20} />
      </div>
      <span
        className={`font-medium ${danger ? "text-red-500" : "text-neutral-700"}`}
      >
        {label}
      </span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-neutral-400 text-sm">{value}</span>}
      <ChevronRight
        size={18}
        className="text-neutral-300 group-hover:translate-x-1 transition-transform"
      />
    </div>
  </button>
);

const Account: React.FC = () => {
  const { lang, setLang } = useSettingsStore();

  return (
    <div className="min-h-screen p-8 text-neutral-900 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-pink/20 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[5%] left-[-5%] w-80 h-80 bg-brand-accent/20 rounded-full blur-[100px] -z-10"></div>

      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Minha Conta</h1>
        <p className="text-neutral-500">
          Gerencie seu perfil e preferências do app.
        </p>
      </header>

      <main className="max-w-2xl mx-auto space-y-8">
        <section className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-4xl p-8 shadow-xl flex flex-col items-center">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 p-2 bg-brand-accent text-white rounded-full shadow-lg scale-0 group-hover:scale-110 transition-transform border-2 border-white">
              <Camera size={18} />
            </div>
          </div>
          <h2 className="mt-4 text-2xl font-bold">Mariana Silva</h2>
          <p className="text-neutral-500">mariana@pinicofit.com</p>
          <button className="mt-4 px-6 py-2 bg-brand-accent/10 text-brand-accent rounded-full text-sm font-bold hover:bg-brand-accent hover:text-white transition-all">
            Editar Perfil
          </button>
        </section>

        <section className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-4xl p-4 shadow-xl">
          <div className="p-4 border-b border-neutral-100/50">
            <h3 className="text-lg font-bold flex items-center gap-2 text-neutral-800">
              <Settings size={20} /> Preferências
            </h3>
          </div>

          <div className="py-2">
            <SettingsRow
              icon={Globe}
              label="Idioma"
              value={lang === "br" ? "Português" : "English"}
              onClick={() => setLang(lang === "br" ? "en" : "br")}
            />
            <SettingsRow icon={Bell} label="Notificações" value="Ativadas" />
            <SettingsRow icon={ShieldCheck} label="Privacidade e Segurança" />
          </div>
        </section>

        <section className="bg-white/40 backdrop-blur-xl border border-white/20 rounded-4xl p-4 shadow-xl">
          <SettingsRow
            icon={LogOut}
            label="Sair da conta"
            danger
            onClick={() => console.log("Logout")}
          />
        </section>
      </main>
    </div>
  );
};

export default memo(Account);
