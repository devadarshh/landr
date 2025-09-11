"use server";

import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { canCreateInterview } from "./permissions";
import { PLAN_LIMIT_MESSAGE, RATE_LIMIT_MESSAGE } from "@/lib/errorToast";
import arcjet, { tokenBucket, request } from "@arcjet/next";
import { generateAiInterviewFeedback } from "@/services/ai/interviews";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const aj = arcjet({
  characteristics: ["userId"],
  key: env.ARCJET_KEY,
  rules: [
    tokenBucket({
      capacity: 12,
      refillRate: 4,
      interval: "1d",
      mode: "LIVE",
    }),
  ],
});

export async function createInterview({
  jobInfoId,
}: {
  jobInfoId: string;
}): Promise<{ error: true; message: string } | { error: false; id: string }> {
  const { userId } = await getCurrentUser();
  if (userId == null) {
    return { error: true, message: "You don't have permission to do this" };
  }

  if (!(await canCreateInterview())) {
    return { error: true, message: PLAN_LIMIT_MESSAGE };
  }

  const decision = await aj.protect(await request(), {
    userId,
    requested: 1,
  });

  if (decision.isDenied()) {
    return { error: true, message: RATE_LIMIT_MESSAGE };
  }

  const jobInfo = await getJobInfo(jobInfoId, userId);
  if (jobInfo == null) {
    return { error: true, message: "You don't have permission to do this" };
  }

  const interview = await prisma.interview.create({
    data: { jobInfoId, duration: "00:00:00" },
  });

  return { error: false, id: interview.id };
}

export async function updateInterview(
  id: string,
  data: { humeChatId?: string; duration?: string }
) {
  const { userId } = await getCurrentUser();
  if (userId == null) {
    return { error: true, message: "You don't have permission to do this" };
  }

  const interview = await getInterview(id, userId);
  if (interview == null) {
    return { error: true, message: "You don't have permission to do this" };
  }

  await prisma.interview.update({
    where: { id },
    data,
  });

  return { error: false };
}

export async function generateInterviewFeedback(interviewId: string) {
  const { userId, user } = await getCurrentUser({ allData: true });
  if (userId == null || user == null) {
    return { error: true, message: "You don't have permission to do this" };
  }

  const interview = await getInterview(interviewId, userId);
  if (interview == null) {
    return { error: true, message: "You don't have permission to do this" };
  }

  if (interview.humeChatId == null) {
    return { error: true, message: "Interview has not been completed yet" };
  }

  const feedback = await generateAiInterviewFeedback({
    humeChatId: interview.humeChatId,
    jobInfo: interview.jobInfo,
    userName: user.name,
  });

  if (feedback == null) {
    return { error: true, message: "Failed to generate feedback" };
  }

  await prisma.interview.update({
    where: { id: interviewId },
    data: { feedback },
  });

  return { error: false };
}

async function getJobInfo(id: string, userId: string) {
  return prisma.jobInfo.findFirst({
    where: {
      id,
      userId,
    },
  });
}

async function getInterview(id: string, userId: string) {
  const interview = await prisma.interview.findFirst({
    where: { id },
    include: {
      jobInfo: {
        select: {
          id: true,
          userId: true,
          description: true,
          title: true,
          experienceLevel: true,
        },
      },
    },
  });

  if (interview == null) return null;

  if (interview.jobInfo.userId !== userId) return null;

  return interview;
}
