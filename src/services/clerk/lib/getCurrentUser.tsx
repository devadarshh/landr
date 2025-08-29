import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

export async function getCurrentUser({ allData = false } = {}) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return { userId: null, redirectToSignIn, user: undefined };
  }

  return {
    userId,
    redirectToSignIn,
    user: allData ? await getUser(userId) : undefined,
  };
}

async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}
