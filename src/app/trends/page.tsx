import TrendsPage from "@pages-ui/TrendsPage";
import {stringify} from "qs";
import type {Filters, QueryParams} from "@api/ApiTypes";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Все новые фильмы',
    description: 'Новинки и самые популярные фильмы 2025 года',
};

export default async function Page() {
    const query: QueryParams = { populate: ['category', 'poster', 'gallery'] };
    const filters: Filters = {}
    filters.releaseYear = { $containsi: 2025 };
    query.filters = filters;
    const res = await fetch(
        `https://front-school-strapi.ktsdev.ru/api/films?${stringify(query, { encode: false })}`,
        {
            next: {
                revalidate: 300,
            },
        }
    );

    const filmsList = await res.json();
    return (
        <TrendsPage filmsList={filmsList.data} />
    )
}
