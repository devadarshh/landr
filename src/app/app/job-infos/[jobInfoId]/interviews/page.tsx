import { JobInfoBackLink } from "@/features/jobinfos/components/JobInfoBackLink";
import { ArrowRightIcon, Loader2Icon, PlusIcon } from "lucide-react";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import Link from "next/link";
import { formatDateTime } from "@/lib/formatters";

export default async function InterviewsPage({
  params,
}: {
  params: Promise<{ jobInfoId: string }>;
}) {
  const { jobInfoId } = await params;
  return (
    <div className="container py-4 gap-4 h-screen-header flex flex-col items-start">
      <JobInfoBackLink jobInfoId={jobInfoId} />

      <Suspense
        fallback={<Loader2Icon className="size-24 animate-spin m-auto" />}
      >
        <SuspendedPage jobInfoId={jobInfoId} />
      </Suspense>
    </div>
  );
}

async function SuspendedPage({ jobInfoId }: { jobInfoId: string }) {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();

  const interviews = await getInterviews(jobInfoId, userId);
  if (interviews.length === 0) {
    return redirect(`/app/job-infos/${jobInfoId}/interviews/new`);
  }
  return (
    <div className="space-y-6 w-full">
      <div className="flex gap-2 justify-between">
        <h1 className="text-3xl md:text-4xl lg:text-5xl">Interviews</h1>
        <Button asChild>
          <Link href={`/app/job-infos/${jobInfoId}/interviews/new`}>
            <PlusIcon />
            New Interview
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 has-hover:*:not-hover:opacity-70">
        <Link
          className="transition-opacity"
          href={`/app/job-infos/${jobInfoId}/interviews/new`}
        >
          <Card className="h-full flex items-center justify-center border-dashed border-3 bg-transparent hover:border-primary/50 transition-colors shadow-none">
            <div className="text-lg flex items-center gap-2">
              <PlusIcon className="size-6" />
              New Interview
            </div>
          </Card>
        </Link>
        {interviews.map((interview) => (
          <Link
            className="hover:scale-[1.02] transition-[transform_opacity]"
            href={`/app/job-infos/${jobInfoId}/interviews/${interview.id}`}
            key={interview.id}
          >
            <Card className="h-full">
              <div className="flex items-center justify-between h-full">
                <CardHeader className="gap-1 flex-grow">
                  <CardTitle className="text-lg">
                    {formatDateTime(interview.createdAt)}
                  </CardTitle>
                  <CardDescription>{interview.duration}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ArrowRightIcon className="size-6" />
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

async function getInterviews(jobInfoId: string, userId: string) {
  const interviews = await prisma.interview.findMany({
    where: {
      jobInfoId: jobInfoId,
      humeChatId: {
        not: null,
      },
      jobInfo: { userId: userId },
    },
    include: { jobInfo: true },
    orderBy: { updatedAt: "desc" },
  });

  return interviews;
}
