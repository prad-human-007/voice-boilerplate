import { z } from "zod";

export const VisaInterviewFeedback = z.object({
    score: z.number(),
    overall_observation: z.string(),
    strengths: z.string(),
    weaknesses: z.string(),
  });