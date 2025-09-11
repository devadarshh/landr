import { prisma } from "@/lib/prisma"; // adjust the path to your prisma client import
import { canCreateQuestion } from "@/features/questions/permissions";
import { PLAN_LIMIT_MESSAGE } from "@/lib/errorToast";
import { generateAiQuestion } from "@/services/ai/questions";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { createDataStreamResponse } from "ai";
import z from "zod";

// You don’t have questionDifficulties enum from Prisma directly,
// so hardcode it to match your schema validation
const schema = z.object({
  prompt: z.enum(["easy", "medium", "hard"]), // adjust if you want Prisma enum later
  jobInfoId: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return new Response("Error generating your question", { status: 400 });
  }

  const { prompt: difficulty, jobInfoId } = result.data;
  const { userId } = await getCurrentUser();

  if (!userId) {
    return new Response("You are not logged in", { status: 401 });
  }

  if (!(await canCreateQuestion())) {
    return new Response(PLAN_LIMIT_MESSAGE, { status: 403 });
  }

  const jobInfo = await getJobInfo(jobInfoId, userId);
  if (!jobInfo) {
    return new Response("You do not have permission to do this", {
      status: 403,
    });
  }

  const previousQuestions = await getQuestions(jobInfoId);

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const res = generateAiQuestion({
        previousQuestions,
        jobInfo,
        difficulty,
        onFinish: async (question) => {
          const created = await prisma.question.create({
            data: {
              content: question,
              jobInfoId,
              // if you want to store difficulty in DB, add a field in schema
            },
          });

          dataStream.writeData({ questionId: created.id });
        },
      });
      res.mergeIntoDataStream(dataStream, { sendUsage: false });
    },
  });
}

async function getQuestions(jobInfoId: string) {
  return prisma.question.findMany({
    where: { jobInfoId },
    orderBy: { createdAt: "asc" },
    select: {
      content: true,
      // If you have a `difficulty` field in DB, include it
      // difficulty: true,
    },
  });
}

async function getJobInfo(id: string, userId: string) {
  return prisma.jobInfo.findFirst({
    where: { id, userId },
    select: {
      id: true,
      title: true,
      description: true,
      experienceLevel: true,
    },
  });
}
