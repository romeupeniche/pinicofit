import React, { memo, useEffect, useState } from "react";
import { Globe, Bell, LifeBuoy, LogOut, User, Activity, Fingerprint } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Profile from "./Profile";
import Goals from "./Goals";
import Preferences from "./Preferences";
import Notifications from "./Notifications";
import Help from "./Help";
import NavItem from "./NavItem";
import { useSettingsStore } from "../../store/settingsStore";
import { AccountUnsavedChangesProvider } from "./AccountUnsavedChangesContext";
import { useBlocker, useLocation } from "react-router-dom";
import About from "./About";

const Account: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const data = location.state;
  const { t } = useSettingsStore();
  const [activeTab, setActiveTab] = useState(data?.tab || "profile");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
  const focusedSection: string = data?.section;
  const blocker = useBlocker(hasUnsavedChanges);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowUnsavedConfirm(true);
    }
  }, [blocker.state]);

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
      component: <Goals focusedGoal={focusedSection} />,
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
      component: <Notifications />,
    },
    {
      id: "help",
      label: t("account.sidebar.help"),
      icon: LifeBuoy,
      component: <Help />,
    },
    {
      id: "about",
      label: t("account.sidebar.about"),
      icon: Fingerprint,
      component: <About />,
    },
  ];

  const handleTabChange = (nextTab: string) => {
    if (nextTab === activeTab) return;
    if (hasUnsavedChanges) {
      setPendingTab(nextTab);
      setShowUnsavedConfirm(true);
      return;
    }
    setActiveTab(nextTab);
  };

  const confirmDiscardChanges = () => {
    setHasUnsavedChanges(false);
    setShowUnsavedConfirm(false);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
      return;
    }
    if (blocker.state === "blocked") {
      blocker.proceed();
    }
  };

  const cancelDiscardChanges = () => {
    setPendingTab(null);
    setShowUnsavedConfirm(false);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  };

  return (
    <AccountUnsavedChangesProvider
      value={{ hasUnsavedChanges, setHasUnsavedChanges }}
    >
      <div className="min-h-screen text-neutral-900 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
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
                  onClick={() => handleTabChange(item.id)}
                />
              ))}
              <div className="pt-4 mt-4 border-t border-neutral-200/50">
                <NavItem
                  icon={LogOut}
                  label={t("account.sidebar.sign_out")}
                  danger
                  onClick={() => setShowLogoutConfirm(true)}
                />
              </div>
            </nav>
          </aside>

          <main
            className={`bg-white/60 border rounded-3xl p-8 shadow-sm min-h-150 transition-colors ${hasUnsavedChanges
              ? "border-amber-300 ring-2 ring-amber-100"
              : "border-white/40"
              }`}
          >
            {menuItems.find((item) => item.id === activeTab)?.component}
          </main>
        </div>

        {showLogoutConfirm ? (
          <div className="fixed inset-0 z-150 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-4xl bg-white p-6 shadow-2xl">
              <h3 className="text-xl font-black text-neutral-900">
                {t("account.logout_confirm.title")}
              </h3>
              <p className="mt-3 text-sm text-neutral-500">
                {t("account.logout_confirm.description")}
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="cursor-pointer rounded-2xl border border-neutral-200 px-4 py-3 font-bold text-neutral-600"
                >
                  {t("account.logout_confirm.cancel")}
                </button>
                <button
                  onClick={logout}
                  className="cursor-pointer rounded-2xl bg-neutral-900 px-4 py-3 font-black uppercase tracking-[0.12em] text-white"
                >
                  {t("account.logout_confirm.confirm")}
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {showUnsavedConfirm ? (
          <div className="fixed inset-0 z-151 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-4xl bg-white p-6 shadow-2xl">
              <h3 className="text-xl font-black text-neutral-900">
                {t("account.unsaved_changes.title")}
              </h3>
              <p className="mt-3 text-sm text-neutral-500">
                {t("account.unsaved_changes.description")}
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={cancelDiscardChanges}
                  className="cursor-pointer rounded-2xl border border-neutral-200 px-4 py-3 font-bold text-neutral-600"
                >
                  {t("account.unsaved_changes.stay")}
                </button>
                <button
                  onClick={confirmDiscardChanges}
                  className="cursor-pointer rounded-2xl bg-neutral-900 px-4 py-3 font-black tracking-[0.12em] text-white"
                >
                  {t("account.unsaved_changes.leave")}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AccountUnsavedChangesProvider>
  );
};

export default memo(Account);
