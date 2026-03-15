import { stringify } from 'qs';

const BASE_URL = 'https://front-school-strapi.ktsdev.ru';
const LIMIT = 10;

export async function fetchInitialFilms() {
    const query = {
        populate: ['category', 'poster', 'gallery'],
        pagination: { page: 1, pageSize: LIMIT },
    };

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
}

export async function fetchCategories() {
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
}
