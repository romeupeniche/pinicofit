import z from "zod";

export const goalsSchema = z.object({
  customAmount: z.coerce
    .number()
    .or(z.nan())
    .refine((val) => !isNaN(Number(val)))
    .pipe(z.number().gt(0).max(999)),
});

export type GoalsFormData = z.infer<typeof goalsSchema>;
