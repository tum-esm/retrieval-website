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
        utc_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })
    .pick({ utc_date: true, total: true });

export type HeatmapItemType = z.infer<typeof heatmapItemSchema>;

export const dayMeasurementSchema = z
    .object({
        collectionId: z.string(),
        collectionName: z.string(),
        id: z.string(),
        created: z.string(),
        updated: z.string(),
        expand: z.object({}),

        proffast_version: z.string().regex(/^2\.\d+$/),
        sensor_id: z.string(),
        location_id: z.string(),
        utc_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        raw_measurement_count: z.number(),
        postprocessed_measurement_count: z.number(),
        raw_measurements: z.preprocess(
            val => (typeof val === 'string' ? JSON.parse(val) : {}),
            z.array(
                z.object({
                    utc_hour: z.number(),
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
            )
        ),
        postprocessed_measurements: z.preprocess(
            val => (typeof val === 'string' ? JSON.parse(val) : {}),
            z.array(
                z.object({
                    utc_hour: z.number(),
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
            )
        ),
    })
    .pick({
        proffast_version: true,
        sensor_id: true,
        location_id: true,
        utc_date: true,
        raw_measurement_count: true,
        postprocessed_measurement_count: true,
        raw_measurements: true,
        postprocessed_measurements: true,
    });

export type DayMeasurementType = z.infer<typeof dayMeasurementSchema>;
