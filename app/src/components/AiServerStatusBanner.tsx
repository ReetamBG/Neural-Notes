"use client";

import React, { useEffect, useState } from "react";
import { StickyBanner } from "./ui/sticky-banner";
import useAiStore from "@/store/ai.store";

const AiServerStatusBanner = () => {
  const { isAiServerReachable, checkAiServerReachability } = useAiStore();
  const [isBannerOpen, setIsBannerOpen] = useState(true);

  useEffect(() => {
    checkAiServerReachability();
  }, [checkAiServerReachability]);

  if (isAiServerReachable || !isBannerOpen) {
    return null;
  }

  return (
    <div className="absolute z-[150] w-full flex justify-center top-2 px-4 py-4">
      <StickyBanner
        hideOnScroll={false}
        className="z-[150] bg-primary rounded-xl top-2 shadow-2xl max-w-2xl"
        onClose={() => setIsBannerOpen(false)}
      >
        <p className="mx-0 text-primary-foreground text-sm drop-shadow-md text-center">
          <strong> AI features are currently offline.</strong>
          <br />
          You can still use the normal notes functionality.
          <br />
          <br />
          Contact me for a demo, or host the service yourself for free (GitHub
          link on the pricing page).
        </p>
      </StickyBanner>
    </div>
  );
};

export default AiServerStatusBanner;
