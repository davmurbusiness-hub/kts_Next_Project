'use client'
import { Navbar, PageText, Text } from '@components/index';
import s from './FavoritesPage.module.scss';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import ListOfFilms from '@components/ListOfFilms';
import type { Film } from '@shared-types/FilmType';
import {useRootStore} from "@providers/StoreProvider";

const FavoritesPage = () => {
    const rootStore = useRootStore();
  React.useEffect(() => {
    rootStore.auth.getFavorite();
  }, []);

  return (
    <div>
      <Navbar actualPage={'favorites'} />
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
            <ListOfFilms
              filmsList={rootStore.auth.favorites}
              buttonText={'Удалить'}
              emptyText={'Вы еще не добавили фильмы в избранное'}
              buttonFunc={(film: Film) => {
                rootStore.auth.removeFavorite(film);
              }}
            />
          ) : (
            <Text className={s.infText} weight={'medium'} view={'p-28'}>
              Похоже вы еще не авторизовались!
            </Text>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(FavoritesPage);
