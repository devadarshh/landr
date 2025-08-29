"use server";

import { prisma } from "@/lib/prisma";

export async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}
