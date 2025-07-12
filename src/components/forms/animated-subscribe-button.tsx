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
    const newStatus = !isSubscribed;
    setIsSubscribed(newStatus);
    onClick?.();

    // Announce subscription status to screen readers
    if (typeof window.announceToScreenReader === 'function') {
      const message = newStatus
        ? 'Successfully subscribed to updates!'
        : 'Unsubscribed from updates.';
      window.announceToScreenReader(message);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isSubscribed ? (
        <motion.button
          className={cn(
            "form-button relative flex w-[200px] items-center justify-center overflow-hidden rounded-md bg-white dark:bg-gray-800 p-[10px] border border-nosyt-purple nosyt-button-hover",
            className,
          )}
          onClick={handleClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.span
            key="action"
            className="relative block h-full w-full font-semibold text-nosyt-purple"
            initial={{ y: -50 }}
            animate={{ y: 0 }}
          >
            {children[1]}
          </motion.span>
        </motion.button>
      ) : (
        <motion.button
          className={cn(
            "form-button relative flex w-[200px] cursor-pointer items-center justify-center rounded-md border-none p-[10px] bg-nosyt-purple text-white nosyt-button-hover",
            className,
          )}
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
