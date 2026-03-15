import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  completeProfileSchema,
  type CompleteProfileFormData,
} from "../../schemas/Auth";

const CompleteProfile: React.FC = () => {
  const navigate = useNavigate();
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
  });

  const onSubmit = (data: CompleteProfileFormData) => {
    // Aqui você enviaria para o backend. No sucesso, atualizamos o Zustand:
    updateProfile({ ...data, isProfileComplete: true });
    navigate("/dashboard");
  };

  return (
    <div className="flex-1 flex items-stretch gap-4 min-h-0 h-full">
      <section className="flex-1 flex flex-col justify-center min-h-0 overflow-y-auto p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Só mais um passo.
          </h1>
          <p className="text-slate-600">
            Precisamos dessas informações para calcular suas metas.
          </p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 max-w-lg mx-auto w-full"
        >
          {/* Grid de Idade e Gênero */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-semibold ml-2">Idade</label>
              <div className="relative h-12 rounded-full overflow-hidden group border border-neutral-300 focus-within:border-brand-accent transition-all">
                <input
                  {...register("age")}
                  type="number"
                  placeholder="25"
                  className="absolute inset-0 bg-transparent px-5 outline-none"
                />
              </div>
              {errors.age && (
                <p className="text-red-500 text-xs mt-1 ml-4">
                  {errors.age.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="font-semibold ml-2">Gênero</label>
              <select
                {...register("gender")}
                className="w-full h-12 rounded-full border border-neutral-300 px-5 outline-none focus:border-brand-accent bg-transparent appearance-none"
              >
                <option value="">Selecione</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
                <option value="other">Outro</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1 ml-4">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          {/* Peso e Altura */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-semibold ml-2">Peso (kg)</label>
              <div className="relative h-12 rounded-full overflow-hidden group border border-neutral-300">
                <div className="absolute -right-2 -top-4 w-12 h-12 bg-brand-pink/20 rounded-full blur-lg pointer-events-none"></div>
                <input
                  {...register("weight")}
                  type="number"
                  step="0.1"
                  placeholder="75.5"
                  className="absolute inset-0 bg-transparent px-5 outline-none"
                />
              </div>
              {errors.weight && (
                <p className="text-red-500 text-xs mt-1 ml-4">
                  {errors.weight.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="font-semibold ml-2">Altura (cm)</label>
              <div className="relative h-12 rounded-full overflow-hidden group border border-neutral-300">
                <div className="absolute -right-2 -top-4 w-12 h-12 bg-brand-accent/20 rounded-full blur-lg pointer-events-none"></div>
                <input
                  {...register("height")}
                  type="number"
                  placeholder="175"
                  className="absolute inset-0 bg-transparent px-5 outline-none"
                />
              </div>
              {errors.height && (
                <p className="text-red-500 text-xs mt-1 ml-4">
                  {errors.height.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 relative group p-px font-semibold rounded-xl transition-transform active:scale-95"
          >
            <span className="absolute inset-0 rounded-xl bg-linear-to-r from-brand-accent via-brand-pink to-brand-accent opacity-70 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative block px-6 py-3 bg-white rounded-[11px] text-center">
              Finalizar Cadastro
            </span>
          </button>
        </form>
      </section>

      {/* Lado da Imagem (Reutilizando sua lógica de contenção) */}
      <section className="hidden xl:flex flex-1 items-center justify-center overflow-hidden h-full">
        <div className="h-full aspect-square flex items-center justify-center p-12">
          {/* <HeroSvg className="max-w-full max-h-full object-contain opacity-80" /> */}
        </div>
      </section>
    </div>
  );
};

export default CompleteProfile;
