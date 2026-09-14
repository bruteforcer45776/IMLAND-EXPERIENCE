import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/per-le-aziende")({
  head: () => ({
    meta: [
      { title: "Membri — IMLAND EXPERIENCE" },
      { name: "description", content: "La rete delle aziende partner di IMLAND EXPERIENCE." },
      { property: "og:title", content: "Membri — IMLAND EXPERIENCE" },
      {
        property: "og:description",
        content: "La rete delle aziende partner di IMLAND EXPERIENCE.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "/member" }],
  }),
  beforeLoad: async () => {
    throw redirect({ to: "/member", replace: true });
  },
  component: () => null,
});
