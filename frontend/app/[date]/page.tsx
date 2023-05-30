import { HeatmapItemType, heatmapItemSchema } from '@/app/lib/custom-types';
import PocketBase from 'pocketbase';

export async function generateStaticParams() {
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

    const results = await pb.collection('data_heatmap').getFullList({
        sort: 'utc',
    });
    const parsedResults: HeatmapItemType[] = results.map(item =>
        heatmapItemSchema.parse(item)
    );
    console.log(parsedResults);

    return parsedResults.map(item => ({
        date: item.utc.substring(0, 10),
    }));
}

export default function Page({ params }: { params: { date: string } }) {
    return <main>Halo to page in app/[date]/page.tsx: {params.date}</main>;
}
