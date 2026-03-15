'use client'
import s from './FilmsPage.module.scss';
import { useObserver } from '@hooks/useObserver';
import {
    Button,
    Input,
    FilmsList,
    Loader,
    MultiDropdown,
    Navbar,
    PageText,
    Text,
} from '@components/index';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import FilmsListStore from '@store/localStores/FilmsListStore/';
import { useLocalStore } from '@hooks/useLocalStore';
import type {Category} from "@shared-types/CategoryType";
import type {MetaFromResponse} from "@api/ApiTypes";
import type {Film} from "@shared-types/FilmType";
import {useRootStore} from "@providers/StoreProvider";

type Props = {
    initialFilms: Film[];
    initialMeta: MetaFromResponse | null;
    initialCategories: Category[];
};

const FilmsPage = ({ initialFilms, initialMeta, initialCategories }: Props) => {
    const rootStore = useRootStore();
    const filmsListStore = useLocalStore(
        () => new FilmsListStore({
            films: initialFilms,
            categories: initialCategories,
            responseMeta: initialMeta ?? undefined,
        })
    );
    const lastElementRef = useRef<HTMLDivElement>(null);

    useObserver(
        lastElementRef,
        filmsListStore.hasMore,
        filmsListStore.isLoading,
        filmsListStore.loadNextPage
    );

    return (


        <div className={s.page}>
            <Navbar actualPage={'films'} />
            <div className={s.container}>
                <PageText
                    title={'Cinema'}
                    description={
                        'Подборка для вечера уже здесь: фильмы, сериалы и новинки. Найди что посмотреть — за пару секунд.'
                    }
                />
                <div className={s.searchSection}>
                    <div className={s.paramsSection}>
                        <div className={s.search}>
                            <Input
                                className={s.searchInput}
                                placeholder={'Искать фильм'}
                                value={filmsListStore.search}
                                onChange={filmsListStore.setSearchValue}
                            />
                            <Button onClick={filmsListStore.searchHandler} className={s.findButton}>
                                Найти
                            </Button>
                        </div>
                        <MultiDropdown
                            value={filmsListStore.selectedCat}
                            onChange={filmsListStore.setCategories}
                            options={filmsListStore.categoryOptions}
                            getTitle={filmsListStore.getDisplayTitle}
                        />
                    </div>
                </div>
                <div className={s.paginationSection}>
                    <div className={s.allFilms}>
                        <p style={{ fontWeight: 'bold', fontSize: 32 }}>Все фильмы</p>
                        {filmsListStore.totalPages > 0 && (
                            <Text color={'accent'} view={'p-20'}>
                                {filmsListStore.totalFilms}
                            </Text>
                        )}
                    </div>
                </div>
            </div>
            <FilmsList
                filmsList={filmsListStore.films}
                buttonText={'В избранное'}
                emptyText={'Фильмов по вашему запросу не найдено, попробуйте еще'}
                isLoading={filmsListStore.isLoading}
                buttonFunc={(film) => {
                    rootStore.auth.addFavorite(film);
                }}
            />

            <div
                style={{ visibility: filmsListStore.isLoading ? 'visible' : 'hidden' }}
                className={s.loader}
            >
                <Loader />
            </div>
            <div ref={lastElementRef} style={{ height: '20px' }} />
        </div>
    );
};

export default observer(FilmsPage);
