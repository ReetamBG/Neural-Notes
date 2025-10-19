"use client";
import { MultiStepLoader as Loader } from "@/components/ui/multi-step-loader";

export function MultiStepLoaderDemo({
  steps,
  loading,
}: {
  steps: string[];
  loading: boolean;
}) {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      {/* Core Loader Modal */}
      <Loader
        loadingStates={steps.map((step) => ({ text: step }))}
        loading={loading}
        duration={2000}
      />
    </div>
  );
}
