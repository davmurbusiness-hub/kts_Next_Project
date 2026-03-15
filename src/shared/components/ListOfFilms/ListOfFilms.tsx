import s from './ListOfFilms.module.scss';
import { Card, Text } from '@components/';
import type { Film } from 'types/FilmType';

export type ListOfFilmsProps = {
  filmsList: Film[];
  buttonText?: string;
  isLoading?: boolean;
  emptyText: string;
  buttonFunc: (film: Film) => void;
};

const ListOfFilms = ({
  filmsList = [],
  buttonText = 'В избранное',
  emptyText = 'Фильмов по вашему запросу не найдено, попробуйте еще',
  isLoading = false,
  buttonFunc = () => null,
}: ListOfFilmsProps) => {
  if (filmsList.length === 0 && !isLoading) {
    return (
      <Text className={s.infText} view={'p-20'} weight={'medium'}>
        {emptyText}
      </Text>
    );
  }

  return (
    <div className={s.listOfFilms}>
      {filmsList.map((film) => (
        <Card
          key={film.documentId}
          title={film.title}
          subtitle={film.shortDescription}
          image={film.gallery[0].url}
          rating={film.rating}
          releaseYear={film.releaseYear}
          ageLimit={film.ageLimit}
          category={film.category.title}
          duration={film.duration}
          actionSlot={film.documentId}
          buttonText={buttonText}
          actionFavorites={() => buttonFunc(film)}
        />
      ))}
    </div>
  );
};

export default ListOfFilms;
