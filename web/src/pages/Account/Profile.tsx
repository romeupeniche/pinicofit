import React from "react";
import type { User } from "../../types/auth";
import { Camera } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";

const Profile: React.FC<{ user: User }> = ({ user }) => {
  const { t } = useSettingsStore();
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-xl font-bold mb-6">{t("account.profile.title")}</h2>

      <section className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8 pb-8 border-b border-neutral-100">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name || "User"}&background=random`}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-brand-accent text-white rounded-full shadow-lg hover:scale-110 transition-transform">
            <Camera size={14} />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-bold">{user?.name || "Usuário"}</h3>
          <p className="text-neutral-500 text-sm mb-4">{user?.email}</p>
          <button className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-semibold hover:bg-brand-accent hover:text-white transition-colors cursor-pointer">
            {t("account.profile.change_picture")}
          </button>
        </div>
      </section>

      <div className="grid gap-6 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t("account.profile.name")}
          </label>
          <input
            type="text"
            defaultValue={user?.name}
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Bio
          </label>
          <textarea
            placeholder="Conte um pouco sobre sua jornada fit..."
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all h-24"
          />
        </div>
        <button className="w-fit px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-brand-accent transition-all cursor-pointer">
          {t("account.profile.save_updates")}
        </button>
      </div>
    </div>
  );
};

export default Profile;
