import { prisma } from "@/lib/prisma"; // your global prisma client
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { hasPermission } from "@/services/clerk/lib/hasPermission";

export async function canCreateInterview() {
  return await Promise.any([
    hasPermission("unlimited_interviews").then(
      (bool) => bool || Promise.reject()
    ),
    Promise.all([hasPermission("1_interview"), getUserInterviewCount()]).then(
      ([has, c]) => {
        if (has && c < 1) return true;
        return Promise.reject();
      }
    ),
  ]).catch(() => false);
}

async function getUserInterviewCount() {
  const { userId } = await getCurrentUser();
  if (userId == null) return 0;

  return getInterviewCount(userId);
}

async function getInterviewCount(userId: string) {
  const c = await prisma.interview.count({
    where: {
      humeChatId: { not: null },
      jobInfo: {
        userId: userId,
      },
    },
  });

  return c;
}
