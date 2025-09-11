import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { hasPermission } from "@/services/clerk/lib/hasPermission";

export async function canCreateQuestion() {
  return await Promise.any([
    // Unlimited questions
    hasPermission("unlimited_questions").then(
      (bool) => bool || Promise.reject()
    ),

    // Up to 5 questions
    Promise.all([hasPermission("5_questions"), getUserQuestionCount()]).then(
      ([has, count]) => {
        if (has && count < 5) return true;
        return Promise.reject();
      }
    ),
  ]).catch(() => false);
}

async function getUserQuestionCount() {
  const { userId } = await getCurrentUser();
  if (userId == null) return 0;

  return getQuestionCount(userId);
}

async function getQuestionCount(userId: string) {
  return prisma.question.count({
    where: {
      jobInfo: {
        userId,
      },
    },
  });
}
