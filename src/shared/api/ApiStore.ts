import {stringify} from 'qs';
import {
    type ApiResponse as ApiResponseType,
    type IApiStore,
    type RequestParams,
    HTTPMethod,
    StatusHTTP,
    type QueryParams,
    type Filters
} from './ApiTypes';
import type {
    FilmDataFromResponse,
    CategoryDataFromResponse,
    FavoriteAddResponse,
    UserType
} from './ApiTypes';
import type {Film} from "@shared-types/FilmType";

const LIMIT = 10;


export default class ApiStore implements IApiStore {
    readonly baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl ?? process.env.NEXT_PUBLIC_API_URL ?? '';
    }

    async request<SuccessT, ErrorT = unknown, ReqT = Record<string, unknown>>(
        params: RequestParams<ReqT>,
        signal?: AbortSignal
    ): Promise<ApiResponseType<SuccessT, ErrorT>> {
        try {
            const url = new URL(`${this.baseUrl}/api${params.endpoint}`);

            const fetchOptions: RequestInit = {
                method: params.method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    ...params.headers,
                },
                signal,
            };

            if (params.method === HTTPMethod.GET && params.data) {
                url.search = stringify(params.data, {encode: false});
            } else if (params.method === HTTPMethod.POST && params.data) {
                fetchOptions.body = JSON.stringify(params.data);
            }

            const response = await fetch(url.toString(), fetchOptions);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                return {
                    success: false,
                    data: errorData as ErrorT,
                    status: response.status,
                };
            }

            const data = await response.json() as SuccessT;
            return {
                success: true,
                data,
                status: response.status,
            };
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                throw error;
            }

            return {
                success: false,
                data: null,
                status: StatusHTTP.UNEXPECTED_ERROR,
            };
        }
    }

    // AUTH
    async login(
        identifier: string,
        password: string
    ): Promise<{ user: UserType; jwt: string } | null> {
        if (!identifier || !password) return null;

        const response = await this.request<{ user: UserType; jwt: string }>({
            endpoint: '/auth/local',
            method: HTTPMethod.POST,
            headers: {},
            data: {identifier, password},
        });

        if (!response.success || !response.data?.jwt) {
            return null;
        }

        return response.data;
    }

    async register(
        username: string,
        email: string,
        password: string,
        signal?: AbortSignal
    ): Promise<{ user: UserType; jwt: string } | null> {
        if (!username || !email || !password) return null;

        const response = await this.request<{ user: UserType; jwt: string }>(
            {
                endpoint: '/auth/local/register',
                method: HTTPMethod.POST,
                headers: {},
                data: {username, email, password},
            },
            signal
        );

        if (!response.success || !response.data?.jwt) {
            return null;
        }

        return response.data;
    }

    // FAVORITES
    async fetchGetFavorites(token: string): Promise<FavoriteAddResponse[] | null> {
        const response = await this.request<FavoriteAddResponse[]>({
            endpoint: '/film-favorites',
            method: HTTPMethod.GET,
            headers: {Authorization: `Bearer ${token}`},
            data: {},
        });

        return response.success ? response.data : null;
    }

    async fetchAddFavorites(token: string, filmId: number) {
        const response = await this.request<FavoriteAddResponse>({
            endpoint: '/film-favorites/add',
            method: HTTPMethod.POST,
            headers: {Authorization: `Bearer ${token}`},
            data: {film: filmId},
        });

        return response.success ? response.data : null;
    }

    async fetchRemoveFavorites(token: string, filmId: number) {
        const response = await this.request<FilmDataFromResponse>({
            endpoint: '/film-favorites/remove',
            method: HTTPMethod.POST,
            headers: {Authorization: `Bearer ${token}`},
            data: {film: filmId},
        });

        return response.success ? response.data : null;
    }

    // CATEGORIES
    async fetchCategories(): Promise<CategoryDataFromResponse | null> {
        const response = await this.request<CategoryDataFromResponse>({
            endpoint: '/film-categories',
            method: HTTPMethod.GET,
            headers: {},
            data: {},
        });

        return response.success ? response.data : null;
    }

    // FILMS LIST
    async fetchData(
        page = 1,
        params?: {
            signal?: AbortSignal;
            searchValue: string;
            selectedCategories: number[];
            sortingInfo: string[];
        }
    ): Promise<FilmDataFromResponse | null> {
        const query: QueryParams = {
            populate: ['category', 'poster', 'gallery'],
            pagination: {
                page,
                pageSize: LIMIT,
            },
        };

        const filters: Filters = {};

        if (params?.searchValue.trim()) {
            filters.title = {$containsi: params.searchValue};
        }

        if (params?.selectedCategories.length) {
            filters.category = {id: {$in: params.selectedCategories}};
        }
        if (params?.sortingInfo.length) {
            query.sort = params.sortingInfo
        }

        if (Object.keys(filters).length > 0) {
            query.filters = filters;
        }

        const response = await this.request<FilmDataFromResponse>(
            {
                endpoint: '/films',
                method: HTTPMethod.GET,
                headers: {},
                data: query,
            },
            params?.signal
        );

        return response.success ? response.data : null;
    }

    // SINGLE FILM
    async fetchFilm(documentId: string, signal?: AbortSignal): Promise<Film | null> {
        if (!documentId.trim()) return null;

        const query = {
            populate: ['category', 'poster', 'gallery'],
        };

        const response = await this.request<FilmDataFromResponse>(
            {
                endpoint: `/films/${encodeURIComponent(documentId)}`,
                method: HTTPMethod.GET,
                headers: {},
                data: query,
            },
            signal
        );

        if (!response.success) {
            return null;
        }

        const data = response.data.data;
        return Array.isArray(data) ? (data[0] ?? null) : data;
    }
}
