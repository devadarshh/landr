"use client";

import { getUser, createUserManually } from "@/features/users/actions";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter();
  const [attempts, setAttempts] = useState(0);
  const [isTimeout, setIsTimeout] = useState(false);
  const [isCreatingManually, setIsCreatingManually] = useState(false);

  useEffect(() => {
    const maxAttempts = 20; // 20 attempts * 250ms = 5 seconds max

    const intervalId = setInterval(async () => {
      if (attempts >= maxAttempts) {
        setIsTimeout(true);
        clearInterval(intervalId);

        // Try to create user manually as fallback
        setIsCreatingManually(true);
        try {
          await createUserManually();
          router.replace("/app");
        } catch (error) {
          console.error("Failed to create user manually:", error);
          // Redirect anyway after failed manual creation
          setTimeout(() => {
            router.replace("/app");
          }, 2000);
        }
        return;
      }

      try {
        const user = await getUser(userId);
        if (user != null) {
          router.replace("/app");
          clearInterval(intervalId);
          return;
        }
      } catch (error) {
        console.error("Error checking user:", error);
      }

      setAttempts((prev) => prev + 1);
    }, 250);

    return () => {
      clearInterval(intervalId);
    };
  }, [userId, router, attempts]);

  if (isCreatingManually) {
    return (
      <div className="text-center">
        <Loader2Icon className="animate-spin size-24 mx-auto mb-4" />
        <p className="text-lg mb-2">Finalizing your account...</p>
        <p className="text-sm text-muted-foreground">Almost done!</p>
      </div>
    );
  }

  if (isTimeout) {
    return (
      <div className="text-center">
        <p className="text-lg mb-4">Taking longer than expected...</p>
        <p className="text-sm text-muted-foreground">
          Setting up your account...
        </p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <Loader2Icon className="animate-spin size-24 mx-auto mb-4" />
      <p className="text-sm text-muted-foreground">
        Setting up your account... ({attempts + 1}/{20})
      </p>
    </div>
  );
}
