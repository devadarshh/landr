"use client";

import { getUser } from "@/features/users/actions";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const user = await getUser(userId);
        console.log("Polling user:", user);

        if (user) {
          clearInterval(intervalId);
          router.replace("/app");
        }
      } catch (err) {
        console.error("Error polling user:", err);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [userId, router]);

  return <Loader2Icon className="animate-spin size-24" />;
}
