import { prisma } from "@/lib/prisma";
import { canCreateQuestion } from "@/features/questions/permissions";
import { PLAN_LIMIT_MESSAGE } from "@/lib/errorToast";
import { generateAiQuestion } from "@/services/ai/questions";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { streamText, createTextStreamResponse } from "ai";
import z from "zod";

const schema = z.object({
  prompt: z.enum(["junior", "mid_level", "senior"]),
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

  // ✅ Build CoreMessage[] instead of a string
  const messages = generateAiQuestion({
    previousQuestions,
    jobInfo,
    difficulty,
  });

  let fullText = "";

  const aiResult = await streamText({
    model: "openai/gpt-4o-mini", // or google("gemini-2.5-flash")
    messages,
  });

  const textStream = new ReadableStream<string>({
    async start(controller) {
      for await (const chunk of aiResult.textStream) {
        fullText += chunk;
        controller.enqueue(chunk);
      }

      // Save to DB after AI finishes
      const created = await prisma.question.create({
        data: { content: fullText, jobInfoId },
      });

      // Send metadata as last chunk
      controller.enqueue(`\n[METADATA]{"questionId":"${created.id}"}`);
      controller.close();
    },
  });

  return createTextStreamResponse({ textStream });
}

async function getQuestions(jobInfoId: string) {
  return prisma.question.findMany({
    where: { jobInfoId },
    orderBy: { createdAt: "asc" },
    select: { content: true },
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
