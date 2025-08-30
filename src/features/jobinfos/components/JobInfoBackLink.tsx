import { BackLink } from "@/components/BackLink";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

export function JobInfoBackLink({
  jobInfoId,
  className,
}: {
  jobInfoId: string;
  className?: string;
}) {
  return (
    <BackLink href={`/app/job-infos/${jobInfoId}`}>
      <Suspense>
        <JobName jobInfoId={jobInfoId} />
      </Suspense>
      Job Description
    </BackLink>
  );
}

async function getJobInfo(jobInfoId: string) {
  return prisma.jobInfo.findUnique({
    where: { id: jobInfoId },
  });
}

async function JobName({ jobInfoId }: { jobInfoId: string }) {
  const jobInfo = await getJobInfo(jobInfoId);
  return jobInfo?.name ?? "Job Description";
}
