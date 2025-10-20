"use client";
import React, { useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Calculate which card should be active based on scroll progress
    const progress = Math.max(0, Math.min(1, latest));
    const cardIndex = Math.floor(progress * cardLength);
    const clampedIndex = Math.min(cardIndex, cardLength - 1);
    setActiveCard(clampedIndex);
  });

  const backgroundColors: string[] = [
    // "#0f172a", // slate-900
    // "#000000", // black
    // "#171717", // neutral-900
  ];

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        animate={{
          backgroundColor: backgroundColors[activeCard % backgroundColors.length],
        }}
        className="sticky top-0 flex h-screen w-full justify-center"
        ref={ref}
      >
        <div className="flex flex-col lg:flex-row w-full max-w-7xl items-center justify-between px-8 py-20 gap-8">
          <div className="flex-1 max-w-2xl">
            <motion.h2
              key={`title-${activeCard}`}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="text-2xl sm:text-3xl lg:text-5xl 2xl:text-6xl font-bold  mb-6 lg:mb-8 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600"
            >
              {content[activeCard].title}
            </motion.h2>
            <motion.p
              key={`desc-${activeCard}`}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
                delay: 0.1,
              }}
              className="text-base sm:text-lg 2xl:text-xl text-muted-foreground leading-relaxed"
            >
              {content[activeCard].description}
            </motion.p>
          </div>
          <div className="flex-1 flex items-center justify-center lg:h-screen min-h-[300px]">
            <motion.div
              key={`content-${activeCard}`}
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.4,
                ease: "easeInOut",
              }}
              className={cn(
                "w-full max-w-lg h-auto overflow-hidden rounded-xl bg-transparent",
                contentClassName,
              )}
            >
              {content[activeCard].content ?? null}
            </motion.div>
          </div>
        </div>
      </motion.div>
      {/* Spacer to create scroll area */}
      <div style={{ height: `${content.length * 100}vh` }} />
    </div>
  );
};
