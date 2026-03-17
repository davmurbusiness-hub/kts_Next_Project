import type {Metadata} from "next";
import CategoriesPage from "@pages-ui/CategoriesPage";
import {fetchGalleryCategories} from "@api/serverApi";

export const metadata: Metadata = {
    title: 'Все новые фильмы',
    description: 'Новинки и самые популярные фильмы 2025 года',
};

export default async function Page() {

     const arr = await fetchGalleryCategories();

    return (
        <CategoriesPage />
    )
}
