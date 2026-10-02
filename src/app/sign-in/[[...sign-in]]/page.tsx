import { SignIn } from "@clerk/nextjs"
import { Skeleton } from "@/components/Skeleton"
import { Suspense } from "react"

export default function SignInPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Suspense fallback={<Skeleton className="h-96 w-80" />}>
        <SignIn />
      </Suspense>
    </div>
  )
}
