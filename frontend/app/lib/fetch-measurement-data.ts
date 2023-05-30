import {
    DayMeasurementType,
    dayMeasurementSchema,
} from '@/app/lib/custom-types';
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://esm-linode.dostuffthatmatters.dev');

export async function fetchDayMeasurementData(
    date: string
): Promise<DayMeasurementType[]> {
    await pb
        .collection('users')
        .authWithPassword(
            process.env.NEXT_PUBLIC_POCKETBASE_IDENTITY || '',
            process.env.NEXT_PUBLIC_POCKETBASE_PASSWORD || ''
        );
    if (!pb.authStore.isValid) {
        throw new Error('Invalid auth data');
    }
    const results = await pb.collection('bulk_measurements').getFullList({
        filter: `utc_date='${date}'&&proffast_version='2.2'`,
    });
    return results.map(item => dayMeasurementSchema.parse(item));
}
