import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  completeProfileSchema,
  type CompleteProfileFormData,
} from "../../schemas/Auth.ts";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";

export function Onboarding() {
  const { user, token, _hasHydrated, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (_hasHydrated) {
      if (!token) {
        navigate("/sign-in");
      } else if (user?.isProfileComplete) {
        navigate("/dashboard");
      }
    }
  }, [_hasHydrated, token, user, navigate]);

  if (!_hasHydrated)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
  });

  const onSubmit = async (data: CompleteProfileFormData) => {
    setIsLoading(true);
    try {
      if (!user?.id) {
        alert("Usuário não encontrado. Por favor, faça login novamente.");
        return navigate("/sign-in");
      }

      await api.patch(`/users/${user.id}`, {
        ...data,
        isProfileComplete: true,
      });

      updateProfile({
        ...data,
        isProfileComplete: true,
      });

      navigate("/dashboard");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;

      const errorMessage =
        err.response?.data?.message || "Erro inesperado ao salvar perfil";

      console.error("Erro no Onboarding:", errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-brand-pink/10 p-8 rounded-2xl shadow-sm border border-white">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            Só mais alguns detalhes...
          </h1>
          <p className="text-neutral-500 mt-2">
            Precisamos dessas informações para calcular suas metas.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Idade
            </label>
            <input
              type="number"
              {...register("age", { valueAsNumber: true })}
              placeholder="Ex: 25"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg outline-none focus:border-brand-accent transition-all"
            />
            {errors.age && (
              <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              {...register("weight", { valueAsNumber: true })}
              placeholder="Ex: 75.5"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg outline-none focus:border-brand-accent transition-all"
            />
            {errors.weight && (
              <p className="text-red-500 text-xs mt-1">
                {errors.weight.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Altura (cm)
            </label>
            <input
              type="number"
              {...register("height", { valueAsNumber: true })}
              placeholder="Ex: 175"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg outline-none focus:border-brand-accent transition-all"
            />
            {errors.height && (
              <p className="text-red-500 text-xs mt-1">
                {errors.height.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Gênero
            </label>
            <select
              {...register("gender")}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg outline-none focus:border-brand-accent transition-all"
            >
              <option value="">Selecione...</option>
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
              <option value="other">Outro</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-accent mb-1">
              Qual a sua meta?
            </label>
            <select
              {...register("goal")}
              className="w-full p-2.5 bg-neutral-50 border border-brand-accent/50 rounded-lg outline-none focus:border-brand-accent transition-all"
            >
              <option value="">Selecione...</option>
              <option value="bulk">Ganhar massa</option>
              <option value="cut">Perder massa</option>
              <option value="maintain">Manter peso</option>
            </select>
            {errors.goal && (
              <p className="text-red-500 text-xs mt-1">{errors.goal.message}</p>
            )}
          </div>

          <div className="flex items-center flex-col gap-3 mt-4 px-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white p-3 rounded-xl font-bold transition-colors shadow-lg shadow-brand-accent/20 cursor-pointer"
            >
              {isLoading ? "Salvando Informações..." : "Finalizar Perfil"}
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="text-neutral-400 text-sm hover:text-red-500 transition-colors py-2 cursor-pointer"
            >
              Entrou na conta errada? Sair
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
