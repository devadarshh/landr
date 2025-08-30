import { ThemeToggle } from "@/components/ThemToggle";
import { PricingTable } from "@/services/clerk/components/PricingTable";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <div>
        <SignInButton />
        <UserButton />
        <ThemeToggle />
      </div>
      <PricingTable />
    </div>
  );
}
