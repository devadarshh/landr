import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

async function getUser(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Prisma error:", error);
    return null;
  }
}

export async function getCurrentUser({ allData = false } = {}) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return { userId: null, redirectToSignIn, user: undefined };
  }

  let user;
  if (allData) {
    try {
      user = await getUser(userId);
    } catch (e) {
      user = undefined;
    }
  }

  return { userId, redirectToSignIn, user };
}
