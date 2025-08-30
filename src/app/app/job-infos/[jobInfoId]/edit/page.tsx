import { BackLink } from "@/components/BackLink";
import { Card, CardContent } from "@/components/ui/card";
import { JobInfoBackLink } from "@/features/jobinfos/components/JobInfoBackLink";
import { JobInfoForm } from "@/features/jobinfos/components/JobInfoForm";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function JobInfoNewPage({
  params,
}: {
  params: { jobInfoId: string };
}) {
  const { jobInfoId } = params;

  return (
    <div className="container my-4 max-w-5xl space-y-4">
      <JobInfoBackLink jobInfoId={jobInfoId} />

      <h1 className="text-3xl md:text-4xl">Edit Job Description</h1>

      <Card>
        <CardContent>
          <Suspense
            fallback={<Loader2 className="size-24 animate-spin mx-auto" />}
          >
            <SuspendedForm jobInfoId={jobInfoId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function SuspendedForm({ jobInfoId }: { jobInfoId: string }) {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();

  const jobInfo = await getJobInfo(jobInfoId, userId);
  if (jobInfo == null) return notFound();

  return <JobInfoForm jobInfo={jobInfo} />;
}

async function getJobInfo(id: string, userId: string) {
  return prisma.jobInfo.findFirst({
    where: {
      id,
      userId,
    },
  });
}
