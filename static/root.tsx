// Stand-in for src/routes/__root.tsx in the static (single HTML file) build:
// no SSR shell, just the providers and the outlet.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import "../src/styles.css";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    document.documentElement.lang = path.startsWith("/kz") ? "kk" : path.startsWith("/en") ? "en" : "ru";
  }, [path]);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="bottom-center" />
    </QueryClientProvider>
  );
}
