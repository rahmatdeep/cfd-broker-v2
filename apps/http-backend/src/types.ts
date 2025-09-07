import z from "zod";

export const SignupSchema = z.object({
  email: z.email(),
});

export const SigninSchema = SignupSchema.required();
