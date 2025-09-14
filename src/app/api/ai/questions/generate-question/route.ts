import { prisma } from "@/lib/prisma";
import { canCreateQuestion } from "@/features/questions/permissions";
import { PLAN_LIMIT_MESSAGE } from "@/lib/errorToast";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { streamText } from "ai";
import type { ReadableStreamDefaultController } from "node:stream/web";
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

  const aiResult = streamText({
    model: "openai/gpt-4", // or whichever model you use
    prompt: `Generate a question for job info ${
      jobInfo.name
    } with difficulty ${difficulty}. Avoid repeating questions in: ${previousQuestions
      .map((q) => q.content)
      .join(" || ")}`,
    onError: ({ error }) => {
      console.error("AI stream error:", error);
    },
  });

  const textStream = aiResult.textStream;

  // Create a ReadableStream that first waits for the AI text, then when it's done, inserts questionId
  const finalStream = new ReadableStream<Uint8Array>({
    async start(controller: ReadableStreamDefaultController) {
      const encoder = new TextEncoder();

      // Collect the AI-generated text (if you need to process or store it)
      let generatedText = "";

      try {
        for await (const chunk of textStream) {
          generatedText += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        console.error("Error reading AI stream:", err);
        controller.error(err);
        return;
      }

      // Once the AI text is fully generated:
      // Save to DB
      const question = await prisma.question.create({
        data: {
          content: generatedText,
          jobInfoId,
        },
      });

      // Then send structured data about the questionId (you could send this as text or JSON)
      const idPayload = JSON.stringify({ questionId: question.id });
      controller.enqueue(encoder.encode(idPayload));

      controller.close();
    },
  });

  return new Response(finalStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

async function getQuestions(jobInfoId: string) {
  return prisma.question.findMany({
    where: { jobInfoId },
    orderBy: { createdAt: "asc" },
  });
}

async function getJobInfo(id: string, userId: string) {
  return prisma.jobInfo.findFirst({
    where: { id, userId },
  });
}
