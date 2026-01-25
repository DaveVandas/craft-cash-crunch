import * as React from "react";

import { cn } from "@/lib/utils";

type Props = React.SVGProps<SVGSVGElement>;

/**
 * A small, premium-feeling crown icon with jewel accents.
 * Uses semantic color tokens via `text-*` classes (no hardcoded colors).
 */
export function JeweledCrown({ className, ...props }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("text-primary", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Crown base */}
      <path
        d="M4 9l4 3 4-6 4 6 4-3v9H4V9z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 18h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Jewel accents */}
      <g className="text-secondary">
        <circle cx="8" cy="11" r="1.1" fill="currentColor" />
      </g>
      <g className="text-accent">
        <circle cx="12" cy="9" r="1.1" fill="currentColor" />
      </g>
      <g className="text-destructive">
        <circle cx="16" cy="11" r="1.1" fill="currentColor" />
      </g>
    </svg>
  );
}
