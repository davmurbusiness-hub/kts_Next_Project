import FilmsList from "@pages-ui/FilmsPage";
import {fetchCategories, fetchInitialFilms} from "@api/serverApi";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Все фильмы',
    description: 'Подборка для вечера уже здесь: фильмы, сериалы и новинки. Найди что посмотреть за пару секунд.',
};

type FilmsRouteProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function FilmsRoute({ searchParams }: FilmsRouteProps) {
    const resolvedParams = await searchParams;
    const queryString = new URLSearchParams(
        Object.entries(resolvedParams).flatMap(([key, value]) =>
            Array.isArray(value)
                ? value.map((v) => [key, v])
                : value !== undefined ? [[key, value]] : []
        )
    ).toString();

    const [filmsData, categoriesData] = await Promise.all([
        fetchInitialFilms(queryString),
        fetchCategories(),
    ]);

    return (
        <FilmsList
            initialFilms={filmsData?.data ?? []}
            initialMeta={filmsData?.meta ?? null}
            initialCategories={categoriesData?.data ?? []}
            initialQueryString={queryString}
        />
    );
}
