import { BackLink } from "@/components/BackLink";
import { Card, CardContent } from "@/components/ui/card";
import { JobInfoBackLink } from "@/features/jobinfos/components/JobInfoBackLink";
import { JobInfoForm } from "@/features/jobinfos/components/JobInfoForm";

export default async function JobInfoNewPage({
  params,
}: {
  params: Promise<{ jobInfoId: string }>;
}) {
  const { jobInfoId } = await params;
  return (
    <div className="container my-4 max-w-5xl space-y-4">
      <JobInfoBackLink jobInfoId={jobInfoId} />
      <h1 className="text-3xl md:text-4xl">Create New Job Description</h1>
      <Card>
        <CardContent>
          <JobInfoForm />
        </CardContent>
      </Card>
    </div>
  );
}
