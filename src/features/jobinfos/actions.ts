"use server";

import { prisma } from "@/lib/prisma";
import { JobInfoFormData } from "./JobInfoSchema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function createJobInfo(values: JobInfoFormData) {
  const { userId } = await auth();
  if (!userId) {
    return { error: true, message: "Unauthorized" };
  }

  let jobInfo;
  try {
    jobInfo = await prisma.jobInfo.create({
      data: {
        name: values.name,
        description: values.description,
        experienceLevel: values.experienceLevel,
        title: values.title,
        user: {
          connect: { id: userId },
        },
      },
    });
  } catch (err) {
    console.error(err);
    return { error: true, message: "Failed to create job info" };
  }

  redirect(`/job-info/${jobInfo.id}`);
}

export async function updateJobInfo(id: string, values: JobInfoFormData) {
  let jobInfo;
  try {
    jobInfo = await prisma.jobInfo.update({
      where: { id },
      data: values,
    });
  } catch (err) {
    console.error(err);
    return { error: true, message: "Failed to update job info" };
  }

  redirect(`/app/job-infos/${jobInfo.id}`);
}
