import { SignUp } from "@clerk/nextjs"
import { Skeleton } from "@/components/Skeleton"
import { Suspense } from "react"

export const instant = false

export default function SignUpPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Suspense fallback={<Skeleton className="h-96 w-80" />}>
        <SignUp />
      </Suspense>
    </div>
  )
}