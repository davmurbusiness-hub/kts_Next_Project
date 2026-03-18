'use client'
import s from './FilmsPage.module.scss';
import {useObserver} from '@hooks/useObserver';
import {
    Button,
    Input,
    FilmsList,
    Loader,
    MultiDropdown,
    Navbar,
    PageText,
    Text, FilmPlayer,
} from '@components/index';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useRef} from 'react';
import FilmsListStore from '@store/localStores/FilmsListStore/';
import {useLocalStore} from '@hooks/useLocalStore';
import type {Category} from "@shared-types/CategoryType";
import type {MetaFromResponse} from "@api/ApiTypes";
import type {Film} from "@shared-types/FilmType";
import {useRootStore} from "@providers/StoreProvider";
import Sorter from "@components/Sorter";
import {useToast} from "@providers/Toast/ToastProvider";
import ModalWindow from "@components/ModalWindow";
import {NonAuthorizedComponent} from "@components/Navbar/FavoritesIcon/FavoritesIcon";
import {FilmCardActionSlot} from "@components/Card/actionCardSlots/ActionCardSlot";

const sortOptions = [
    {id: 'rating', label: 'Рейтинг'},
    {id: 'releaseYear', label: 'Год'},
];

type FilmsPageProps = {
    initialFilms: Film[];
    initialMeta: MetaFromResponse | null;
    initialCategories: Category[];
    initialQueryString: string;
};

const FilmsPage = ({initialFilms, initialMeta, initialCategories, initialQueryString}: FilmsPageProps) => {
    const rootStore = useRootStore();
    const toast = useToast();

    const filmsListStore = useLocalStore(
        () => new FilmsListStore({
            films: initialFilms,
            categories: initialCategories,
            responseMeta: initialMeta ?? undefined,
            rootStore: rootStore,
            toast: toast,
            initialQueryString,
        })
    );
    const lastElementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        filmsListStore.init();
    }, [filmsListStore]);

    useObserver(
        lastElementRef,
        filmsListStore.hasMore,
        filmsListStore.isLoading,
        filmsListStore.loadNextPage
    );

    return (
        <div className={s.page}>
            <Navbar actualPage={'films'}/>
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
                        <div className={s.filters}>
                            <MultiDropdown
                                value={filmsListStore.selectedCat}
                                onChange={filmsListStore.setCategories}
                                options={filmsListStore.categoryOptions}
                                getTitle={filmsListStore.getDisplayTitle}
                            />
                            <Sorter
                                options={sortOptions}
                                value={filmsListStore.selectedSortState}
                                onChange={filmsListStore.setSort}
                            />
                        </div>
                    </div>
                </div>
                <div className={s.paginationSection}>
                    <div className={s.allFilms}>
                        <p style={{fontWeight: 'bold', fontSize: 32}}>Все фильмы</p>
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
                emptyText="Фильмов по вашему запросу не найдено, попробуйте еще"
                isLoading={filmsListStore.isLoading}
                actionCardSlot={(film) => (
                    <FilmCardActionSlot
                        trailerUrl={film.trailerUrl}
                        buttonText="В избранное"
                        actionFavorites={() => filmsListStore.handleFavoriteClick(film)}
                        consists={rootStore.auth.favorites.some(f => f.id === film.id)}
                        onWatchTrailer={filmsListStore.openTrailer}
                    />
                )}
            />
            <ModalWindow isOpen={filmsListStore.isTrailerOpen} onClose={filmsListStore.closeTrailer}>
                <FilmPlayer trailerUrl={filmsListStore.trailerUrl} autoPlay={true} />
            </ModalWindow>
            <ModalWindow
                isOpen={filmsListStore.isModalOpen}
                onClose={filmsListStore.closeModal}
            >
                <NonAuthorizedComponent/>
            </ModalWindow>

            <div
                style={{visibility: filmsListStore.isLoading ? 'visible' : 'hidden'}}
                className={s.loader}
            >
                <Loader/>
            </div>
            <div ref={lastElementRef} style={{height: '20px'}}/>
        </div>
    );
};

export default observer(FilmsPage);
