"use server";

import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getUserIdTag, revalidateUserCache } from "./dbCache";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));

  return db.query.UserTable.findFirst({
    where: eq(UserTable.id, id),
  });
}

export async function createUserManually() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  try {
    // Get user data from Clerk
    const clerkUser = await (await clerkClient()).users.getUser(userId);

    const email = clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    if (!email) throw new Error("No primary email found");

    // Create user in our database
    const userData = {
      id: clerkUser.id,
      email,
      name:
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        "User",
      imageUrl: clerkUser.imageUrl,
      createdAt: new Date(clerkUser.createdAt),
      updatedAt: new Date(clerkUser.updatedAt),
    };

    await db
      .insert(UserTable)
      .values(userData)
      .onConflictDoUpdate({
        target: [UserTable.id],
        set: userData,
      });

    revalidateUserCache(userId);
    return userData;
  } catch (error) {
    console.error("Failed to create user manually:", error);
    throw error;
  }
}
