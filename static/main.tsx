import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { RouterProvider, createMemoryHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "../src/routeTree.gen";
import { localePath, type Locale } from "@/lib/i18n";

// Memory history: the page is opened from file://, and the site already uses
// the URL hash for sections and case links.
let start = "/";
try {
  const saved = localStorage.getItem("zhan_lang") as Locale | null;
  if (saved && localePath[saved]) start = localePath[saved];
} catch {}

const router = createRouter({
  routeTree,
  history: createMemoryHistory({ initialEntries: [start] }),
  context: { queryClient: new QueryClient() },
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
