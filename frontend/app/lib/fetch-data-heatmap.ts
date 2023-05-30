import { HeatmapItemType, heatmapItemSchema } from '@/app/lib/custom-types';
import PocketBase from 'pocketbase';

export async function fetchDataHeatmap(): Promise<HeatmapItemType[]> {
    const pb = new PocketBase('https://esm-linode.dostuffthatmatters.dev');
    await pb
        .collection('users')
        .authWithPassword(
            process.env.NEXT_PUBLIC_POCKETBASE_IDENTITY || '',
            process.env.NEXT_PUBLIC_POCKETBASE_PASSWORD || ''
        );
    if (!pb.authStore.isValid) {
        throw new Error('Invalid auth data');
    }
    const results = await pb.collection('data_heatmap').getFullList();
    return results.map(item => heatmapItemSchema.parse(item));
}
