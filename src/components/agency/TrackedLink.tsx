"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "./Analytics";

interface TrackedLinkProps extends ComponentProps<typeof Link> {
  eventName: string;
  eventParams?: Record<string, unknown>;
}

export default function TrackedLink({
  eventName,
  eventParams,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent(eventName, eventParams);
        onClick?.(e);
      }}
    >
      {children}
    </Link>
  );
}
