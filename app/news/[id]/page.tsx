import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchNewsById } from '@/lib/news';
import { NewsDetailClient } from './page.client';

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = params.id;
    const news = await fetchNewsById(id);

    if (!news) {
        return {
            title: 'News Not Found',
            description: 'The news article you are looking for does not exist.',
        };
    }

    return {
        title: `${news.title_en} | Malaysia Solar Atap News`,
        description: news.content_en.substring(0, 160),
    };
}


export default async function NewsDetail({ params }: Props) {
    const news = await fetchNewsById(params.id);

    if (!news) {
        notFound();
    }

    return <NewsDetailClient news={news} />;
}
