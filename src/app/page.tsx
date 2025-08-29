import { ThemeToggle } from "@/components/ThemToggle";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <SignInButton />
      <UserButton />
      <ThemeToggle />
    </div>
  );
}
