import { auth } from "@clerk/nextjs/server";
import { getCurrentUser } from "./getCurrentUser";

type Permission =
  | "unlimited_resume_analysis"
  | "unlimited_interviews"
  | "unlimited_questions"
  | "1_interview"
  | "5_questions";

const ADMIN_EMAILS = ["imadarshsingh2002@gmail.com"];

export async function hasPermission(permission: Permission) {
  // Check if user is admin first - admins have all permissions
  try {
    const { user } = await getCurrentUser({ allData: true });
    if (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return true;
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
  }

  const { has } = await auth();
  return has({ feature: permission });
}
