import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen flex w-screen items-center justify-center">
      <SignIn />
    </div>
  );
}
