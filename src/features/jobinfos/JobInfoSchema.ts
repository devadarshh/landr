import { z } from "zod";
import { ExperienceLevel } from "@prisma/client";

export const jobInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().nullable().optional(),
  description: z.string().min(1, "Description is required"),
  experienceLevel: z.nativeEnum(ExperienceLevel),
});

export type JobInfoFormData = z.infer<typeof jobInfoSchema>;
