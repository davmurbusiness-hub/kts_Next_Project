import FavoritesPage from "@/pages-ui/FavoritesPage";
import type {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Избранное',
    description: 'Ваши любимые фильмы собраны в одном месте',
};

export default async function Page() {
    return (
        <FavoritesPage/>
    )
}
