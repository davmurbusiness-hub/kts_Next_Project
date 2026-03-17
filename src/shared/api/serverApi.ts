import {parse, stringify} from 'qs';
import type {Category} from "@shared-types/CategoryType";

const BASE_URL = 'https://front-school-strapi.ktsdev.ru';
const LIMIT = 10;

export async function fetchInitialFilms(queryString?: string) {
    const params = queryString ? parse(queryString) : {};

    const search = typeof params.search === 'string' ? params.search.trim() : '';
    const rawCategories = params.categories;
    const categories = (
        Array.isArray(rawCategories) ? rawCategories : rawCategories !== undefined ? [rawCategories] : []
    ).map(Number).filter(Boolean);
    const sort = (
        Array.isArray(params.sort) ? params.sort : params.sort !== undefined ? [params.sort] : []
    ).map(String);

    const query: Record<string, unknown> = {
        populate: ['category', 'poster', 'gallery'],
        pagination: { page: 1, pageSize: LIMIT },
    };

    const filters: Record<string, unknown> = {};

    if (search) {
        filters.title = { $containsi: search };
    }

    if (categories.length) {
        filters.category = { id: { $in: categories } };
    }

    if (sort.length) {
        query.sort = sort;
    }

    if (Object.keys(filters).length > 0) {
        query.filters = filters;
    }

    try {
        const res = await fetch(
            `${BASE_URL}/api/films?${stringify(query, { encode: false })}`,
            {
                next: {
                    revalidate: 300,
                    tags: ['films'],
                },
            }
        );

        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

export async function fetchCategories() {
    try {
        const res = await fetch(
            `${BASE_URL}/api/film-categories`,
            {
                next: {
                    revalidate: 3600,
                    tags: ['categories'],
                },
            }
        );

        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}


export async function fetchGalleryCategories() {
    const categories = await fetchCategories();

    const baseQuery = {
        populate: ['category', 'poster', 'gallery'],
        pagination: { page: 1, pageSize: 1 },
    };

    const galleryUrls: Array<{ categoryId: number; url: string } | null> = await Promise.all(
        categories.data.map(async (category: Category) => {
            const categoryId = typeof category === 'object' ? category.id : category;
            const query = {
                ...baseQuery,
                filters: {
                    category: {
                        id: { $eq: categoryId },
                    },
                },
            };

            const queryString = new URLSearchParams(
                JSON.parse(JSON.stringify(query))
            ).toString();

            const url = `${BASE_URL}/api/films?${queryString}`;
            console.log(url);
            try {
                const res = await fetch(url, {
                    next: {
                        revalidate: 3600,
                        tags: ['categories'],
                    },
                });

                if (!res.ok) return null;

                const json = await res.json();

                const filmData = json.data?.[0];
                if (!filmData) return null;

                const attributes = filmData.attributes || filmData;

                const gallery = attributes.gallery?.data || attributes.gallery;
                if (!Array.isArray(gallery) || gallery.length === 0) return null;

                const firstImage = gallery[0];
                const imageUrl = firstImage.attributes?.url || firstImage.url;
                if (!imageUrl) return null;

                return { categoryId, url: imageUrl };
            } catch (error) {
                console.error(`Ошибка при загрузке галереи для категории ${categoryId}:`, error);
                return null;
            }
        })
    );

    return galleryUrls.filter((item): item is { categoryId: number; url: string } => item !== null);
}
