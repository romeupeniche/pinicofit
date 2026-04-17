import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';
import {
    Fingerprint,
    Mail,
    User2,
    Info
} from 'lucide-react';
import GithubIcon from '../../components/GithubIcon';
import LinkedinIcon from '../../components/LinkedinIcon';

const About: React.FC = () => {
    const { t } = useSettingsStore();

    const socialLinks = [
        {
            name: "GitHub",
            icon: <GithubIcon size={20} />,
            url: "https://github.com/romeupeniche",
            color: "hover:text-neutral-900"
        },
        {
            name: "LinkedIn",
            icon: <LinkedinIcon size={20} />,
            url: "https://linkedin.com/in/romeupeniche",
            color: "hover:text-blue-600"
        },
        {
            name: "Email",
            icon: <Mail size={20} />,
            url: "mailto:romeupeniche12@hotmail.com",
            color: "hover:text-brand-accent"
        }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold">{t("account.about.title")}</h2>
                    <p className="text-sm text-neutral-500">{t("account.about.subtitle")}</p>
                </div>
                <Fingerprint className="text-neutral-300" size={30} />
            </div>

            <div className="space-y-6">
                <div className="rounded-3xl border border-neutral-200 bg-white/60 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-brand-accent">
                        <Info size={18} />
                        <h3 className="font-bold text-neutral-800 tracking-tight">
                            {t("account.about.app_proposal_title")}
                        </h3>
                    </div>
                    <p className="text-neutral-600 leading-relaxed text-sm">
                        {t("account.about.app_proposal_text")}
                    </p>
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-white/60 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-brand-accent">
                        <User2 size={18} />
                        <h3 className="font-bold text-neutral-800 tracking-tight">
                            {t("account.about.developer_title")}
                        </h3>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="h-18 w-18 shrink-0 rounded-full bg-brand-accent/20 border border-brand-accent/80">
                            <img src="/profile.png" alt="Profile Picture" className='rounded-full' />
                        </div>
                        <div>
                            <p className="font-bold text-neutral-900 text-lg">Romeu Peniche</p>
                            <p className="text-sm text-neutral-500 mt-1">
                                {t("account.about.developer_bio")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-2">
                        {t("account.about.links_title")}
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-neutral-200 bg-white/40 text-neutral-500 transition-all ${link.color} hover:bg-white hover:border-brand-accent group`}
                            >
                                <div className="transition-transform group-hover:scale-110">
                                    {link.icon}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-tighter">
                                    {link.name}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="pt-4 flex flex-col items-center justify-center gap-2">
                    <div className="h-px w-12 bg-neutral-200" />
                    <p className="text-[10px] font-medium text-neutral-400 uppercase tracking-[0.2em]">
                        {t("account.about.luana")} ❤️
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;