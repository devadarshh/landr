import { deleteUser, upsertUser } from "@/features/users/db";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Clerk webhook received");
    const event = await verifyWebhook(request);
    console.log("Webhook verified, event type:", event.type);

    switch (event.type) {
      case "user.created":
      case "user.updated":
        const clerkData = event.data;
        console.log("Processing user event for ID:", clerkData.id);
        console.log("Full event data:", JSON.stringify(clerkData, null, 2));

        // Validate required fields
        if (!clerkData.id) {
          console.error("No user ID found in webhook data");
          return new Response("No user ID found", { status: 400 });
        }

        const email = clerkData.email_addresses?.find(
          (e) => e.id === clerkData.primary_email_address_id
        )?.email_address;

        if (!email) {
          console.error("No primary email found for user:", clerkData.id);
          console.error(
            "Available email addresses:",
            clerkData.email_addresses
          );
          return new Response("No primary email found", { status: 400 });
        }

        const userData = {
          id: clerkData.id,
          email,
          name:
            `${clerkData.first_name || ""} ${
              clerkData.last_name || ""
            }`.trim() || "User",
          imageUrl: clerkData.image_url || "",
          createdAt: new Date(clerkData.created_at),
          updatedAt: new Date(clerkData.updated_at),
        };

        console.log("Upserting user:", userData.id, userData.email);
        await upsertUser(userData);
        console.log("User upserted successfully");

        break;
      case "user.deleted":
        if (event.data.id == null) {
          console.error("No user ID found for deletion");
          return new Response("No user ID found", { status: 400 });
        }

        console.log("Deleting user:", event.data.id);
        await deleteUser(event.data.id);
        console.log("User deleted successfully");
        break;
      default:
        console.log("Unhandled event type:", event.type);
    }

    console.log("Webhook processed successfully");
    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Invalid webhook", { status: 400 });
  }
}
