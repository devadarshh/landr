import { BackLink } from "@/components/BackLink";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

export function JobInfoBackLink({
  jobInfoId,
  className,
}: {
  jobInfoId: string;
  className?: string;
}) {
  return (
    <BackLink
      href={`/app/job-infos/${jobInfoId}`}
      className={cn("mb-4", className)}
    >
      <Suspense fallback="Job Description">
        <JobName jobInfoId={jobInfoId} />
      </Suspense>
    </BackLink>
  );
}

async function JobName({ jobInfoId }: { jobInfoId: string }) {
  const jobInfo = await getJobInfo(jobInfoId);
  return jobInfo?.name ?? "Job Description";
}

async function getJobInfo(id: string) {
  return prisma.jobInfo.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
    },
  });
}
