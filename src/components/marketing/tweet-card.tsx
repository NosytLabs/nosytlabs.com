import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

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
                  <Icon name="check" size={12} className="text-white" />
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
          <Icon name="twitter" size={20} />
        </a>
      </div>

      {/* Content */}
      <div className="text-gray-900 dark:text-gray-100">
        <p className="leading-relaxed">{content}</p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <ul className="flex space-x-6 text-sm text-gray-500" role="list">
          <li>
            <li>
              <button className="flex items-center space-x-1 transition-colors hover:text-purple-500">
                <Icon name="messageCircle" size={16} />
                <span>Reply</span>
              </button>
            </li>
          </li>
          <li>
            <li>
              <button className="flex items-center space-x-1 transition-colors hover:text-purple-500">
                <Icon name="repeat" size={16} />
                <span>Retweet</span>
              </button>
            </li>
          </li>
          <li>
            <li>
              <button className="flex items-center space-x-1 transition-colors hover:text-purple-500">
                <Icon name="heart" size={16} />
                <span>Like</span>
              </button>
            </li>
          </li>
        </ul>
        <a
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 transition-colors hover:text-purple-500"
        >
          <Icon name="externalLink" size={16} />
        </a>
      </div>
    </div>
  );
};
