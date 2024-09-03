'use client';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_API_KEY!, {
    api_host: '/ingest',
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export function CSPostHogProvider({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') {
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
  } else {
    return <>{children}</>;
  }
}
