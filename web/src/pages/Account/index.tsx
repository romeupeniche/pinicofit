import React, { memo, useState } from "react";
import { Globe, Bell, ShieldCheck, LogOut, User, Activity } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Profile from "./Profile";
import Goals from "./Goals";
import Preferences from "./Preferences";
import NavItem from "./NavItem";
import { useSettingsStore } from "../../store/settingsStore";

const Account: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { t } = useSettingsStore();
  const [activeTab, setActiveTab] = useState("profile");

  const menuItems = [
    {
      id: "profile",
      label: t("account.sidebar.profile"),
      icon: User,
      component: <Profile user={user!} />,
    },
    {
      id: "goals",
      label: t("account.sidebar.goals"),
      icon: Activity,
      component: <Goals />,
    },
    {
      id: "preferences",
      label: t("account.sidebar.preferences"),
      icon: Globe,
      component: <Preferences />,
    },
    {
      id: "notifications",
      label: t("account.sidebar.notifications"),
      icon: Bell,
      component: null,
    },
    {
      id: "security",
      label: t("account.sidebar.security"),
      icon: ShieldCheck,
      component: null,
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 text-neutral-900 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-pink/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[5%] left-[-5%] w-80 h-80 bg-brand-accent/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <aside className="space-y-6">
          <div className="px-4">
            <h1 className="text-2xl font-bold tracking-tight">
              {t("account.title")}
            </h1>
            <p className="text-sm text-neutral-500">{t("account.subtitle")}</p>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
              />
            ))}
            <div className="pt-4 mt-4 border-t border-neutral-200/50">
              <NavItem
                icon={LogOut}
                label={t("account.sidebar.sign_out")}
                danger
                onClick={logout}
              />
            </div>
          </nav>
        </aside>

        <main className="bg-white/60 backdrop-blur-2xl border border-white/40 rounded-3xl p-8 shadow-sm min-h-[600px]">
          {menuItems.find((item) => item.id === activeTab)?.component}
        </main>
      </div>
    </div>
  );
};

export default memo(Account);
