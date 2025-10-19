import { motion } from "motion/react";

const LoadingContent = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <p className="text-center text-xl font-medium text-muted-foreground">
        Loading
      </p>
      <div className="flex space-x-2 mt-4 justify-center">
        <motion.span
          className="w-3 h-3 bg-primary/50 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut",
            delay: 0,
          }}
        />
        <motion.span
          className="w-3 h-3 bg-primary/50 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />
        <motion.span
          className="w-3 h-3 bg-primary/50 rounded-full"
          animate={{ y: [0, -5, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut",
            delay: 0.6,
          }}
        />
      </div>
    </div>
  );
};

export default LoadingContent;