import FilmsList from "@pages-ui/FilmsPage";
import {fetchCategories, fetchInitialFilms} from "@api/serverApi";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Все фильмы',
    description: 'Подборка для вечера уже здесь: фильмы, сериалы и новинки. Найди что посмотреть за пару секунд.',
};

export default async function FilmsRoute() {

  const [filmsData, categoriesData] = await Promise.all([
        fetchInitialFilms(),
        fetchCategories(),
    ]);

    return (
        <FilmsList
            initialFilms={filmsData?.data ?? []}
            initialMeta={filmsData?.meta ?? null}
            initialCategories={categoriesData?.data ?? []}
        />
    );
}
