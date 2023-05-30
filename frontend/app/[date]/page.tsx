import { fetchDataHeatmap } from '@/app/lib/fetch-data-heatmap';

export async function generateStaticParams() {
    const dataHeatmap = await fetchDataHeatmap();
    return dataHeatmap.map(item => ({
        date: item.utc.substring(0, 10),
    }));
}

export default function Page({ params }: { params: { date: string } }) {
    return <main>Halo to page in app/[date]/page.tsx: {params.date}</main>;
}
