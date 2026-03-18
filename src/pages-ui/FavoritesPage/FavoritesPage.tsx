'use client'
import {Navbar, PageText, Text} from '@components/index';
import s from './FavoritesPage.module.scss';
import {observer} from 'mobx-react-lite';
import * as React from 'react';
import {useState} from 'react';
import FilmsList from '@components/FilmsList';
import {useRootStore} from "@providers/StoreProvider";
import {useToast} from "@providers/Toast/ToastProvider";
import {FilmCardActionSlot} from "@components/Card/actionCardSlots/ActionCardSlot";
import ModalWindow from "@components/ModalWindow";
import FilmPlayer from "@components/FilmPlayer";

const FavoritesPage = () => {
    const rootStore = useRootStore();
    const toast = useToast();
    const [trailerUrl, setTrailerUrl] = useState('');
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    const openTrailer = (url: string) => {
        setTrailerUrl(url);
        setIsTrailerOpen(true);
    };

    const closeTrailer = () => {
        setIsTrailerOpen(false);
        setTrailerUrl('');
    };

    return (
        <div>
            <Navbar actualPage={'favorites'}/>
            <div className={s.container}>
                <PageText
                    title={'Избранное'}
                    description={
                        '          Подборка для вечера уже здесь: фильмы, сериалы и новинки.' +
                        '          Ваши любимые фильмы собраны в одном месте!'
                    }
                />
                <div>
                    {rootStore.auth.authorized ? (
                        <FilmsList
                            filmsList={rootStore.auth.favorites}
                            emptyText={'Вы еще не добавили фильмы в избранное'}
                            actionCardSlot={(film) => (
                                <FilmCardActionSlot
                                    trailerUrl={film.trailerUrl}
                                    buttonText="Удалить"
                                    actionFavorites={() => {
                                        toast.success("Фильм '" + film.title + "' был успешно удален из избранного.");
                                        rootStore.auth.removeFavorite(film);
                                    }}
                                    consists={false}
                                    onWatchTrailer={openTrailer}
                                />
                            )}
                        />
                    ) : (
                        <Text className={s.infText} weight={'medium'} view={'p-28'}>
                            Похоже вы еще не авторизовались!
                        </Text>
                    )}
                </div>
            </div>

            <ModalWindow isOpen={isTrailerOpen} onClose={closeTrailer}>
                <FilmPlayer trailerUrl={trailerUrl} autoPlay={true}/>
            </ModalWindow>
        </div>
    );
};

export default observer(FavoritesPage);
