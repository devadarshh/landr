"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function ensureCurrentUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) throw new Error("Not authenticated");

  const email =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress || clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) throw new Error("No email available for current user");

  const name = `${clerkUser.firstName ?? ""} ${
    clerkUser.lastName ?? ""
  }`.trim();

  // Check for existing by email first
  const existingByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingByEmail) {
    // Ensure Clerk id is attached to this user
    return prisma.user.update({
      where: { email },
      data: {
        id: clerkUser.id, // ⚠️ only works if id is NOT primary key
        name,
        imageUrl: clerkUser.imageUrl,
      },
    });
  }

  // If no conflict, upsert by id
  return prisma.user.upsert({
    where: { id: clerkUser.id },
    update: {
      email,
      name,
      imageUrl: clerkUser.imageUrl,
    },
    create: {
      id: clerkUser.id,
      email,
      name,
      imageUrl: clerkUser.imageUrl,
    },
  });
}
