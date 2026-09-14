import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

import { podcastProgramList } from "@/data/podcast-programs";

export default defineTool({
  name: "list_podcast_programs",
  title: "Elenca i canali podcast",
  description: "Elenca i canali podcast di IMLAND Experience con categoria e numero di puntate.",
  inputSchema: {
    category: z.string().trim().optional().describe("Filtra per categoria, es. Cibo, Cultura, Business."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category }) => {
    const rows = podcastProgramList
      .filter((p) => !category || p.cat.toLowerCase() === category.toLowerCase())
      .map((p) => ({
        slug: p.slug,
        name: p.name,
        category: p.cat,
        tagline: p.tagline,
        episodes: p.episodes.length,
        url: `/podcast/${p.slug}`,
      }));

    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { programs: rows },
    };
  },
});
