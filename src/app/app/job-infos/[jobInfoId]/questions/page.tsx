import { prisma } from "@/lib/prisma";
import { canCreateQuestion } from "@/features/questions/permissions";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { Loader2Icon } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { NewQuestionClientPage } from "./_NewQuestionClientPage";

export default async function QuestionsPage({
  params,
}: {
  params: Promise<{ jobInfoId: string }>;
}) {
  const { jobInfoId } = await params;

  return (
    <Suspense
      fallback={
        <div className="h-screen-header flex items-center justify-center">
          <Loader2Icon className="animate-spin size-24" />
        </div>
      }
    >
      <SuspendedComponent jobInfoId={jobInfoId} />
    </Suspense>
  );
}

async function SuspendedComponent({ jobInfoId }: { jobInfoId: string }) {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();

  if (!(await canCreateQuestion())) return redirect("/app/upgrade");

  const jobInfo = await getJobInfo(jobInfoId, userId);
  if (!jobInfo) return notFound();

  return <NewQuestionClientPage jobInfo={jobInfo} />;
}

async function getJobInfo(id: string, userId: string) {
  return prisma.jobInfo.findFirst({
    where: {
      id,
      userId,
    },
  });
}
