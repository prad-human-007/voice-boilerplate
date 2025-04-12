'use client'

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Layout({ children }: {children: ReactNode}) {
  const router = useRouter();
    return (
      <div className="hero-grid p-2 overflow-y-auto flex flex-col items-center h-screen mt-5 md:mt-0 md:justify-center">
        <header>
          {/* <Navbar /> */}
        </header>
        <main className="flex flex-col gap-3">
          <div>
          <Button className="rounded-3xl" onClick={() => router.push('/')}><ArrowLeft /> Home</Button>
          </div>
          {children}
        </main>
        <footer>
          {/* <Footer /> */}
        </footer>
      </div>
    );
}