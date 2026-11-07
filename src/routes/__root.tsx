// Root layout: providers and the outlet. The site is fully client-rendered.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import "../styles.css";
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
