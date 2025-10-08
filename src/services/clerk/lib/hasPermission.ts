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
    console.log("Checking permission:", permission, "for user:", user?.email);
    
    if (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      console.log("User is admin, granting permission:", permission);
      return true;
    }
  } catch (error) {
    console.error("Error checking admin status:", error);
  }

  const { has } = await auth();
  const result = has({ feature: permission });
  console.log("Clerk permission check result for", permission, ":", result);
  return result;
}
