import { getCurrentUser } from "@/services/clerk/lib/getCurrentUser";
import { redirect } from "next/navigation";
import { OnboardingClient } from "./_client";

export default async function OnboardingPage() {
  // First load – attempts auto-create (ensure=true default)
  const first = await getCurrentUser({ allData: true });
  const { userId } = first;
  const { user } = first;

  // Not signed in → redirect home
  if (userId == null) return redirect("/");

  // If created in same request, redirect immediately
  if (user) return redirect("/app");

  // Quick second attempt without trying to recreate again (ensure=false)
  const second = await getCurrentUser({ allData: true, ensure: false });
  if (second.user) return redirect("/app");

  return (
    <div className="container flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-4xl">Creating your account...</h1>
      {/* Client will continue polling until user appears, then pushes /app */}
      <OnboardingClient userId={userId} />
    </div>
  );
}
