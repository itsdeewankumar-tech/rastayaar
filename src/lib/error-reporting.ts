// Client-side error reporting hook for the root error boundary.
//
// This is intentionally provider-agnostic: it currently just logs to the
// console with route context. If you add an error-monitoring service later
// (Sentry, Bugsnag, PostHog, etc.), wire its `captureException` call in here
// so every caller of `reportClientError` picks it up automatically.

export function reportClientError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error("[client error]", {
    message,
    stack,
    route: window.location.pathname,
    ...context,
  });

  // Example: hook up a real provider here, e.g.
  // Sentry.captureException(error, { extra: { route: window.location.pathname, ...context } });
}
