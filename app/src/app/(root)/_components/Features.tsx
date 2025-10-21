"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import Image from "next/image";

const Features = () => {
  const content = [
    {
      title: "Intelligent Note-Taking",
      description:
        "Organize your thoughts effortlessly. Create folders, write in Markdown, and keep all your notes neatly structured. Your study space, optimized.",
      content: (
        <Image
          src="/mockups/dashboard.png"
          alt="dashboard mockup"
          width={600}
          height={0}
          className="h-full w-full object-contain"
        />
      ),
    },
    {
      title: "AI Tutor at Your Fingertips",
      description:
        "Upload any PDF, text, or video, and instantly chat with an AI that teaches, explains, and answers questions on the topic—like having a personal tutor 24/7.",
      content: (
        <div className="border-6 rounded-xl overflow-hidden">
          <Image
            src="/mockups/chatbot.png"
            width={600}
            height={0}
            className="h-full w-full object-cover"
            alt="AI Tutor"
          />
        </div>
      ),
    },
    {
      title: "Smart Analysis & Roadmaps",
      description:
        "Let AI evaluate your notes against reference materials. Get instant feedback on accuracy, missing points, and suggested study roadmaps to level up your learning efficiently.",
      content: (
        <div className="border-6 rounded-xl overflow-hidden">
          <Image
            src="/mockups/analysis.png"
            width={600}
            height={0}
            className="h-full w-full object-cover"
            alt="AI Tutor"
          />
        </div>
      ),
    },
  ];
  return (
    <section id="features" className="w-full h-auto bg-neutral-950">
      <div className="mx-auto max-w-7xl 2xl:max-w-8xl">
        <h2 className="mx-8 text-3xl font-bold sm:text-7xl text-primary">
          What you get
        </h2>
        <StickyScroll content={content} />
      </div>
    </section>
  );
};

export default Features;
