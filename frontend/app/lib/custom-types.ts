import { z } from 'zod';

export const heatmapItemSchema = z
    .object({
        collectionId: z.string(),
        collectionName: z.string(),
        id: z.string(),
        created: z.string(),
        updated: z.string(),
        expand: z.object({}),
        total: z.number(),
        utc: z.string(),
    })
    .pick({ utc: true, total: true });

export type HeatmapItemType = z.infer<typeof heatmapItemSchema>;

export const dayMeasurementSchema = z
    .object({
        collectionId: z.string(),
        collectionName: z.string(),
        id: z.string(),
        created: z.string(),
        updated: z.string(),
        expand: z.object({}),
        utc: z.string(),
        proffast_version: z.string(),
        location_id: z.string(),
        sensor_id: z.string(),
        raw: z.boolean(),
        gnd_p: z.number(),
        gnd_t: z.number(),
        app_sza: z.number(),
        azimuth: z.number(),
        xh2o: z.number(),
        xair: z.number(),
        xco2: z.number(),
        xch4: z.number(),
        xco: z.number(),
        xch4_s5p: z.number(),
    })
    .pick({
        utc: true,
        sensor_id: true,
        location_id: true,
        gnd_p: true,
        app_sza: true,
        azimuth: true,
        xco2: true,
        xch4: true,
    });

export type DayMeasurementType = z.infer<typeof dayMeasurementSchema>;
