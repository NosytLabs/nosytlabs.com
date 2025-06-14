import React from "react";
import { cn } from "@/lib/utils";
import { Twitter, ExternalLink } from "lucide-react";

interface TweetCardProps {
  className?: string;
  username?: string;
  handle?: string;
  content: string;
  timestamp?: string;
  verified?: boolean;
  tweetUrl?: string;
}

export const TweetCard: React.FC<TweetCardProps> = ({
  className,
  username = "NosytLabs",
  handle = "NOSYTLABS",
  content,
  timestamp = "2h",
  verified = false,
  tweetUrl = "https://twitter.com/NOSYTLABS",
}) => {
  return (
    <div
      className={cn(
        "relative flex max-w-lg flex-col gap-3 overflow-hidden rounded-xl border border-purple-200/20 bg-white/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-300/40 hover:shadow-lg dark:border-purple-700/20 dark:bg-purple-950/80",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-lg font-bold text-purple-600">
                N
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {username}
              </h3>
              {verified && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-purple-500">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>@{handle}</span>
              <span>·</span>
              <span>{timestamp}</span>
            </div>
          </div>
        </div>
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-500 transition-colors hover:text-purple-600"
        >
          <Twitter className="h-5 w-5" />
        </a>
      </div>

      {/* Content */}
      <div className="text-gray-900 dark:text-gray-100">
        <p className="leading-relaxed">{content}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex space-x-6 text-sm text-gray-500">
          <button className="flex items-center space-x-1 transition-colors hover:text-purple-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Reply</span>
          </button>
          <button className="flex items-center space-x-1 transition-colors hover:text-purple-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Retweet</span>
          </button>
          <button className="flex items-center space-x-1 transition-colors hover:text-purple-500">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Like</span>
          </button>
        </div>
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 transition-colors hover:text-purple-500"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};
