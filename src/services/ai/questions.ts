import { ExperienceLevel, JobInfo, Question } from "@prisma/client";
import { CoreMessage } from "ai";
import { google } from "./models/google";

/**
 * Build AI messages for generating a new interview question.
 */
export function generateAiQuestion({
  jobInfo,
  previousQuestions,
  difficulty,
}: {
  jobInfo: Pick<JobInfo, "title" | "description" | "experienceLevel">;
  previousQuestions: Pick<Question, "content">[];
  difficulty: ExperienceLevel;
}): CoreMessage[] {
  const previousMessages: CoreMessage[] = previousQuestions.map((q) => ({
    role: "assistant",
    content: q.content,
  }));

  return [
    {
      role: "system",
      content: `You are an AI assistant that creates technical interview questions tailored to a specific job role.
Your task is to generate one realistic and relevant technical question that matches the skill requirements of the job and aligns with the difficulty level.

Job Information:
- Job Description: \`${jobInfo.description}\`
- Experience Level: \`${jobInfo.experienceLevel}\`
${jobInfo.title ? `- Job Title: \`${jobInfo.title}\`` : ""}

Guidelines:
- Use the difficulty provided: "junior", "mid_level", or "senior".
- Prefer practical, real-world challenges over trivia.
- Return only one **question** in markdown format, no answer.
- Stop as soon as the full question is provided.`,
    },
    ...previousMessages,
    {
      role: "user",
      content: `Generate a new ${difficulty} question for this role.`,
    },
  ];
}

/**
 * Build AI messages for generating feedback on an answer.
 */
export function generateAiQuestionFeedback({
  question,
  answer,
}: {
  question: string;
  answer: string;
}): CoreMessage[] {
  return [
    {
      role: "system",
      content: `You are an expert technical interviewer. Your job is to evaluate the candidate's answer to a technical interview question.

Instructions:
- Assign a rating from 1 to 10
- Provide concise, constructive feedback
- Include a full correct answer in the output
- Stop after providing rating, feedback, and correct answer
- Write feedback as if directly addressing the candidate.`,
    },
    {
      role: "user",
      content: `The original question was:\n\n${question}\n\nThe candidate answered:\n\n${answer}`,
    },
  ];
}
