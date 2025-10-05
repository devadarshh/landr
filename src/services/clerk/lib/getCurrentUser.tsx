import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@prisma/client";

// Keep return shape consistent: { userId, user }
interface GetCurrentUserOptions {
  allData?: boolean;
  ensure?: boolean; // auto-create if missing (fallback when webhook not fired)
}

interface BaseResult {
  userId: string | null;
  user: User | null;
}

interface DbErrorResult extends BaseResult {
  dbError: true;
}

type GetCurrentUserResult = BaseResult | (BaseResult & Partial<DbErrorResult>);

export async function getCurrentUser({
  allData = false,
  ensure = true,
}: GetCurrentUserOptions = {}): Promise<GetCurrentUserResult> {
  const { userId } = await auth();
  if (!userId) return { userId: null, user: null };

  if (!allData) return { userId, user: null };

  let user = null;
  try {
    user = await prisma.user.findUnique({ where: { id: userId } });
  } catch (e) {
    console.error("getCurrentUser: DB lookup failed", e);
    return { userId, user: null, dbError: true };
  }

  if (!user && ensure) {
    try {
      const clerk = await currentUser();
      if (clerk) {
        const email =
          clerk.emailAddresses.find((e) => e.id === clerk.primaryEmailAddressId)
            ?.emailAddress || clerk.emailAddresses[0]?.emailAddress;
        if (email) {
          user = await prisma.user.upsert({
            where: { id: clerk.id },
            update: {
              email,
              name: `${clerk.firstName ?? ""} ${clerk.lastName ?? ""}`.trim(),
              imageUrl: clerk.imageUrl,
            },
            create: {
              id: clerk.id,
              email,
              name: `${clerk.firstName ?? ""} ${clerk.lastName ?? ""}`.trim(),
              imageUrl: clerk.imageUrl,
            },
          });
        }
      }
    } catch (e) {
      console.error("getCurrentUser: ensure user failed", e);
    }
  }

  return { userId, user };
}
