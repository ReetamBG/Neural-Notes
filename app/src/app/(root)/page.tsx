import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import {   BookOpen, Brain, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const user  = await currentUser();

  return (
    <div className="min-h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-screen mx-auto p-4 relative z-10">
        <h1 className="relative z-10 text-4xl sm:text-7xl 2xl:text-[6rem] text-primary flex flex-col sm:flex-row items-center justify-center text-center gap-8 font-sans font-bold">
          <Brain className="size-16 2xl:size-20" />
          Neural Notes
        </h1>
        <br />
        <h2 className="text-2xl sm:text-6xl 2xl:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Learn smarter with your notes
        </h2>
        <p className="mt-8 text-neutral-400 max-w-lg mx-auto my-2 text-sm md:text-base 2xl:text-xl text-center relative z-10">
          Turn your notes, PDFs, and videos into an AI study companion -
          Interact with your material, uncover weak spots, and get personalized roadmaps
          to master any topic.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4 relative z-10">
          {user ? (
            <Link href={"/dashboard"}>
              <Button size="lg" className="font-bold hover:-translate-y-1 hover:scale-105">
                <BookOpen />My Notes
              </Button>
            </Link>
          ) : (
            <SignInButton mode="modal" forceRedirectUrl={"/dashboard"}>
              <Button
                size="lg"
                className="font-bold uppercase hover:-translate-y-1 hover:scale-105"
              >
                Start Learning <ChevronRight />
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
}
