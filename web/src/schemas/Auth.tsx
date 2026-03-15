import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(3, "Nome muito curto"),
    email: z.email("Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const completeProfileSchema = z.object({
  age: z.coerce
    .number()
    .min(10, "Idade mínima 10 anos")
    .max(100, "Idade inválida"),
  weight: z.coerce
    .number()
    .min(30, "Peso muito baixo")
    .max(300, "Peso muito alto"),
  height: z.coerce
    .number()
    .min(100, "Altura mínima 100cm")
    .max(250, "Altura inválida"),
  gender: z.enum(["male", "female", "other"], {
    errorMap: () => ({ message: "Selecione um gênero" }),
  }),
});

export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;
