import Image from "next/image";
import { Button } from "@/components/ui/button";
import { NavbarMain } from "@/components/ui/header";
import HeroSectionOne from "@/components/hero-section-demo-1";
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <NavbarMain className="absolute top-0" />

      <HeroSectionOne />
    </div>
  );
}
