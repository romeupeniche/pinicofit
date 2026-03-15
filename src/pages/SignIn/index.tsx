import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import HeroSvg from "./HeroSvg";
import { loginSchema, type LoginFormData } from "../../schemas/Auth";

const SignIn: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmitForm = (data: LoginFormData) => {
    console.log("Tentativa de login com:", data);
  };

  return (
    <div className="flex-1 flex items-center gap-4">
      <section className="flex-1 flex flex-col justify-center h-full">
        <header className="p-4 flex flex-col">
          <h1 className="text-3xl">Bem-vindo de volta.</h1>
          <p>Entre para continuar sua evolução e bater as metas de hoje.</p>
        </header>
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="flex flex-col gap-8 justify-center items-center p-4 px-16"
        >
          <div className="w-full">
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
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="w-full">
            <label htmlFor="password" className="font-semibold text-lg">
              Senha
            </label>
            <div className="relative w-full h-12 rounded-full overflow-hidden group">
              <div className="absolute -right-2 -top-4 w-16 h-16 bg-brand-accent/20 rounded-full blur-lg pointer-events-none z-0"></div>
              <div className="absolute right-6 -bottom-4 w-16 h-16 bg-brand-pink/20 rounded-full blur-lg pointer-events-none z-0"></div>
              <input
                {...register("password")}
                placeholder="senha123"
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
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="relative group inline-block w-[50%]">
            <button
              type="submit"
              className="relative inline-block p-px font-semibold leading-6  shadow-2xl cursor-pointer rounded-xl transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95 w-full"
            >
              <span className="absolute inset-0 rounded-xl bg-linear-to-r from-brand-accent/10 via-brand-pink/30 to-brand-accent/50 p-0.5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

              <span className="relative z-10 block px-6 py-3 rounded-xl">
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  <span className="transition-all duration-500 group-hover:translate-x-1 tracking-normal group-hover:tracking-wide">
                    Vamos continuar
                  </span>
                  <svg
                    className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1"
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
            Não tem uma conta?{" "}
            <a href="/sign-up" className="text-brand-accent">
              Cadastrar
            </a>
          </span>
          <span className="text-sm text-slate-600">
            Esqueceu sua senha?{" "}
            <a href="" className="text-brand-accent">
              Recuperar
            </a>
          </span>
        </div>
      </section>
      <section className="flex-1 relative hidden xl:flex items-center justify-center h-full min-h-0 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <HeroSvg className="max-h-full max-w-full w-auto h-auto object-contain" />
        </div>
      </section>
    </div>
  );
};

export default SignIn;
