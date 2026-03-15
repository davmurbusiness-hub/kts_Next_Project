import { notFound } from 'next/navigation';
import FilmPage from '@pages-ui/FilmPage/FilmPage';
import { stringify } from 'qs';

async function fetchFilm(documentId: string) {
    const query = { populate: ['category', 'poster', 'gallery'] };


    const res = await fetch(
        `https://front-school-strapi.ktsdev.ru/api/films/${encodeURIComponent(documentId)}?${stringify(query, { encode: false })}`,
        {
            next: {
                revalidate: 300,
                tags: [`film-${documentId}`],
            },
        }
    );

    if (!res.ok) return null;

    const data = await res.json();
    const filmData = data.data;
    return Array.isArray(filmData) ? (filmData[0] ?? null) : filmData;
}

export async function generateMetadata({ params }: { params: { documentId: string } }) {
    const { documentId } = await params;
    const film = await fetchFilm(documentId);

    if (!film) return { title: 'Фильм не найден' };

    return {
        title: film.title,
        description: film.description,
        openGraph: {
            title: film.title,
            description: film.description,
            images: film.poster?.url ? [{ url: film.poster.url }] : [],
        },
    };
}

export default async function FilmRoute({ params }: { params: { documentId: string } }) {
    const { documentId } = await params;
    const film = await fetchFilm(documentId);

    if (!film) notFound();

    return <FilmPage initialFilm={film} documentId={documentId} />;
}
