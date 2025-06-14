"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedSubscribeButtonProps {
  subscribeStatus?: boolean;
  children: React.ReactNode[];
  className?: string;
  onClick?: () => void;
}

export const AnimatedSubscribeButton: React.FC<AnimatedSubscribeButtonProps> = ({
  subscribeStatus = false,
  children,
  className,
  onClick,
}) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(subscribeStatus);

  const handleClick = () => {
    setIsSubscribed(!isSubscribed);
    onClick?.();
  };

  return (
    <AnimatePresence mode="wait">
      {isSubscribed ? (
        <motion.button
          className={cn(
            "relative flex w-[200px] items-center justify-center overflow-hidden rounded-md bg-white p-[10px] outline outline-1 outline-purple-400",
            className,
          )}
          onClick={handleClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.span
            key="action"
            className="relative block h-full w-full font-semibold"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            style={{ color: "#7c3aed" }}
          >
            {children[1]}
          </motion.span>
        </motion.button>
      ) : (
        <motion.button
          className={cn(
            "relative flex w-[200px] cursor-pointer items-center justify-center rounded-md border-none p-[10px]",
            className,
          )}
          style={{ backgroundColor: "#7c3aed", color: "white" }}
          onClick={handleClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.span
            key="reaction"
            className="relative block font-semibold"
            initial={{ x: 0 }}
            exit={{ x: 50, transition: { duration: 0.1 } }}
          >
            {children[0]}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
