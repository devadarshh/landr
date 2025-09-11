import { ExperienceLevel } from "@prisma/client";

export function formatQuestionDifficulty(difficulty: ExperienceLevel) {
  switch (difficulty) {
    case "junior":
      return "Junior";
    case "mid_level":
      return "Mid Level";
    case "senior":
      return "Senior";
    default:
      throw new Error(
        `Unknown question difficulty: ${difficulty satisfies never}`
      );
  }
}
