import { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const event = await verifyWebhook(request);
    if (event.type === "user.created" || event.type === "user.updated") {
      const clerkData = event.data;
      const email = clerkData.email_addresses.find(
        (e) => e.id === clerkData.primary_email_address_id
      )?.email_address;
      if (!email) {
        return new Response("No primary email found", { status: 400 });
      }

      await prisma.user.upsert({
        where: { id: clerkData.id },
        update: {
          email,
          name: `${clerkData.first_name ?? ""} ${
            clerkData.last_name ?? ""
          }`.trim(),
          imageUrl: clerkData.image_url,
        },
        create: {
          id: clerkData.id,
          email,
          name: `${clerkData.first_name ?? ""} ${
            clerkData.last_name ?? ""
          }`.trim(),
          imageUrl: clerkData.image_url,
        },
      });
    } else if (event.type == "user.deleted") {
      const clerkData = event.data;
      const userId = clerkData.id;
      if (!userId) {
        return new Response("No user id found", { status: 400 });
      }
      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } else {
      return new Response("Event ignored", { status: 200 });
    }
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response("Invalid webhook", { status: 400 });
  }

  return new Response("Webhook received", { status: 200 });
}
