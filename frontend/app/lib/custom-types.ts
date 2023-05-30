import { z } from 'zod';

export const heatmapItemSchema = z.object({
    collectionId: z.string(),
    collectionName: z.string(),
    id: z.string(),
    total: z.number(),
    utc: z.string(),
    created: z.string(),
    updated: z.string(),
    expand: z.object({}),
});

export type HeatmapItemType = z.infer<typeof heatmapItemSchema>;
