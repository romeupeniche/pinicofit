import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
// @ts-expect-error - import is correct
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpFormData } from "../../schemas/Auth.ts";
import { useAuthStore } from "../../store/authStore.ts";
import type { AxiosError } from "axios";
import api from "../../services/api.ts";
import { useSettingsStore } from "../../store/settingsStore.ts";
import type { TranslationKeys } from "../../types/i18n.ts";

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { t } = useSettingsStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmitForm = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post("/users", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      const { access_token, user } = response.data;

      if (!access_token || !user) {
        console.error("ERRO: API não retornou token ou user!");
        return;
      }

      setAuth(user, access_token);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      setErrorMsg(
        t(err.response?.data?.message as TranslationKeys) || t("sign_up.error"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center gap-4">
      <section className="flex-1 flex flex-col justify-center h-full">
        <header className="p-4 flex flex-col">
          <h1 className="text-3xl">{t("sign_up.title")}</h1>
          <p>{t("sign_up.subtitle")}</p>
        </header>
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          onFocus={() => setErrorMsg("")}
          className="flex flex-col gap-8 justify-center items-center p-4 xl:px-16"
        >
          <div className="flex xl:flex-row flex-col w-full gap-4">
            <div className="w-full flex-1">
              <label htmlFor="name" className="font-semibold text-lg">
                {t("sign_up.name")}
              </label>
              <div className="relative w-full h-12 rounded-full overflow-hidden group">
                <div className="absolute -right-2 -top-4 w-16 h-16 bg-brand-accent/40 rounded-full blur-lg pointer-events-none z-0"></div>
                <div className="absolute right-6 -bottom-4 w-16 h-16 bg-brand-pink/40 rounded-full blur-lg pointer-events-none z-0"></div>
                <input
                  {...register("name")}
                  placeholder="John Doe"
                  type="text"
                  className="absolute inset-0 z-10 bg-transparent border border-neutral-300 text-neutral-900 placeholder-neutral-500 text-md rounded-full px-5 py-2.5 outline-none focus:border-brand-accent transition-all"
                />
                <div className="absolute inset-0 border border-transparent group-focus-within:border-brand-accent/50 rounded-full pointer-events-none"></div>
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 ml-4">
                  {t(errors.name.message)}
                </p>
              )}
            </div>
            <div className="w-full flex-2">
              <label htmlFor="email" className="font-semibold text-lg">
                Email
              </label>
              <div className="relative w-full h-12 rounded-full overflow-hidden group">
                <div className="absolute -right-2 -top-4 w-16 h-16 bg-brand-accent/40 rounded-full blur-lg pointer-events-none z-0"></div>
                <div className="absolute right-6 -bottom-4 w-16 h-16 bg-brand-pink/40 rounded-full blur-lg pointer-events-none z-0"></div>
                <input
                  {...register("email")}
                  placeholder="john@doe.com"
                  type="email"
                  className="absolute inset-0 z-10 bg-transparent border border-neutral-300 text-neutral-900 placeholder-neutral-500 text-md rounded-full px-5 py-2.5 outline-none focus:border-brand-accent transition-all"
                />
                <div className="absolute inset-0 border border-transparent group-focus-within:border-brand-accent/50 rounded-full pointer-events-none"></div>
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-4">
                  {t(errors.email.message)}
                </p>
              )}
            </div>
          </div>
          <div className="flex w-full gap-4">
            <div className="w-full">
              <label htmlFor="password" className="font-semibold text-lg">
                {t("sign_up.password")}
              </label>
              <div className="relative w-full h-12 rounded-full overflow-hidden group">
                <div className="absolute -right-2 -top-4 w-16 h-16 bg-brand-accent/20 rounded-full blur-lg pointer-events-none z-0"></div>
                <div className="absolute right-6 -bottom-4 w-16 h-16 bg-brand-pink/20 rounded-full blur-lg pointer-events-none z-0"></div>
                <input
                  {...register("password")}
                  placeholder={t("sign_up.pass_placeholder")}
                  type={showPassword ? "text" : "password"}
                  className="absolute inset-0 z-10 bg-transparent border border-neutral-300 text-neutral-900 placeholder-neutral-500 text-md rounded-full pl-5 pr-12 py-2.5 outline-none focus:border-brand-accent transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-brand-accent/70 hover:text-brand-accent transition-colors duration-300 cursor-pointer"
                >
                  <div className="relative h-6 w-6 overflow-hidden">
                    <Eye
                      className="absolute inset-0 transition-all duration-500 ease-in-out"
                      style={{
                        clipPath: showPassword
                          ? "inset(0 0 0 0)"
                          : "inset(0 0 0 100%)",
                      }}
                      size={24}
                    />
                    <EyeOff
                      className="absolute inset-0 transition-all duration-500 ease-in-out"
                      style={{
                        clipPath: !showPassword
                          ? "inset(0 0 0 0)"
                          : "inset(0 100% 0 0)",
                      }}
                      size={24}
                    />
                  </div>
                </button>

                <div className="absolute inset-0 border border-transparent group-focus-within:border-brand-accent/50 rounded-lg pointer-events-none"></div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-4">
                  {t(errors.password.message)}
                </p>
              )}
            </div>
            <div className="w-full">
              <label
                htmlFor="confirmPassword"
                className="font-semibold text-lg"
              >
                {t("sign_up.confirm_password")}
              </label>
              <div className="relative w-full h-12 rounded-full overflow-hidden group">
                <div className="absolute -right-2 -top-4 w-16 h-16 bg-brand-accent/20 rounded-full blur-lg pointer-events-none z-0"></div>
                <div className="absolute right-6 -bottom-4 w-16 h-16 bg-brand-pink/20 rounded-full blur-lg pointer-events-none z-0"></div>
                <input
                  {...register("confirmPassword")}
                  placeholder={t("sign_up.pass_placeholder")}
                  type={showConfirmPassword ? "text" : "password"}
                  className="absolute inset-0 z-10 bg-transparent border border-neutral-300 text-neutral-900 placeholder-neutral-500 text-md rounded-full pl-5 pr-12 py-2.5 outline-none focus:border-brand-accent transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-brand-accent/70 hover:text-brand-accent transition-colors duration-300 cursor-pointer"
                >
                  <div className="relative h-6 w-6 overflow-hidden">
                    <Eye
                      className="absolute inset-0 transition-all duration-500 ease-in-out"
                      style={{
                        clipPath: showConfirmPassword
                          ? "inset(0 0 0 0)"
                          : "inset(0 0 0 100%)",
                      }}
                      size={24}
                    />
                    <EyeOff
                      className="absolute inset-0 transition-all duration-500 ease-in-out"
                      style={{
                        clipPath: !showConfirmPassword
                          ? "inset(0 0 0 0)"
                          : "inset(0 100% 0 0)",
                      }}
                      size={24}
                    />
                  </div>
                </button>

                <div className="absolute inset-0 border border-transparent group-focus-within:border-brand-accent/50 rounded-lg pointer-events-none"></div>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-4">
                  {t(errors.confirmPassword.message)}
                </p>
              )}
            </div>
          </div>
          <div className="relative group inline-block w-[80%] xl:w-[50%]">
            <div className="text-red-500 text-sm text-center">{errorMsg}</div>
            <button
              type="submit"
              disabled={isLoading}
              className="relative inline-block p-px font-semibold leading-6  shadow-2xl cursor-pointer rounded-xl transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 w-full"
            >
              <span className="absolute inset-0 rounded-xl bg-linear-to-r from-brand-accent/10 via-brand-pink/30 to-brand-accent/50 p-0.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

              <span className="relative z-10 block px-6 py-3 rounded-xl">
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  <span className="transition-all duration-500 group-hover:translate-x-1 tracking-normal group-hover:tracking-wide text-neutral-900">
                    {isLoading
                      ? t("sign_up.loading")
                      : t("sign_up.sign_up_button")}
                  </span>
                  <svg
                    className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1 text-neutral-900"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </span>
            </button>
          </div>
        </form>
        <div className="flex justify-between px-16 mt-4">
          <span className="text-sm text-slate-600">
            {t("sign_up.sign_in_button").split("?")[0]}
            {"? "}
            <a href="/sign-in" className="text-brand-accent">
              {t("sign_up.sign_in_button").split("?")[1]}
            </a>
          </span>
        </div>
      </section>
      <section className="flex-1 w-full h-full lg:flex hidden items-center justify-center relative">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-full h-full bg-purple-200 rounded-full blur-3xl opacity-80 animate-pulse" />
          <img
            src="/hero_signup_tiny.webp"
            alt="Carregando..."
            className={`
              absolute inset-0 w-full h-full object-contain
              transition-opacity duration-500
              ${isImageLoaded ? "opacity-0" : "opacity-100"}
            `}
          />
          <img
            src="hero_signup.webp"
            alt="Hero"
            fetchPriority="high"
            loading="eager"
            onLoad={() => setIsImageLoaded(true)}
            className={`
          relative z-10 w-full h-full object-contain max-h-[75lvh] transition-opacity duration-500
          ${isImageLoaded ? "opacity-100" : "opacity-0"}
        `}
          />
        </div>
      </section>
    </div>
  );
};

export default SignUp;
