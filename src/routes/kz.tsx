import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing/Landing";
import { localeHead } from "@/lib/i18n";

export const Route = createFileRoute("/kz")({
  head: () => localeHead("kz"),
  component: () => <Landing locale="kz" />,
});
