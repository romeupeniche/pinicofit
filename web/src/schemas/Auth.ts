import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(3, "zod.sign_up.name"),
    email: z.email("zod.sign_up.email"),
    password: z.string().min(6, "zod.sign_up.password"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "zod.sign_up.confirm_password",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email("zod.sign_in.email"),
  password: z.string().min(1, "zod.sign_in.password"),
});

export type signInFormData = z.infer<typeof signInSchema>;

export const completeProfileSchema = z.object({
  age: z.coerce
    .number()
    .or(z.nan())
    .refine((val) => !isNaN(Number(val)), "zod.onboarding.age.required")
    .pipe(
      z
        .number()
        .min(10, "zod.onboarding.age.min")
        .max(100, "zod.onboarding.age.max"),
    ),
  weight: z.coerce
    .number()
    .or(z.nan())
    .refine((val) => !isNaN(Number(val)), "zod.onboarding.weight.required")
    .pipe(
      z
        .number()
        .min(30, "zod.onboarding.weight.min")
        .max(300, "zod.onboarding.weight.max"),
    ),
  height: z.coerce
    .number()
    .or(z.nan())
    .refine((val) => !isNaN(Number(val)), "zod.onboarding.height.required")
    .pipe(
      z
        .number()
        .min(100, "zod.onboarding.height.min")
        .max(250, "zod.onboarding.height.max"),
    ),
  gender: z
    .string()
    .min(1, "zod.onboarding.gender.required")
    .refine((val) => ["male", "female", "other"].includes(val), {
      message: "zod.onboarding.gender.invalid",
    }) as z.ZodType<"male" | "female" | "other">,
  goal: z
    .string()
    .min(1, "zod.onboarding.goal.required")
    .refine((val) => ["bulk", "cut", "maintain"].includes(val), {
      message: "zod.onboarding.goal_options.invalid",
    }) as z.ZodType<"bulk" | "cut" | "mantain">,
});

export type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;
