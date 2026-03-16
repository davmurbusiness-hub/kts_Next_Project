import s from './FilmInfo.module.scss';
import { Text } from '@components/index';
import type { Film } from '@/shared/types/FilmType';
import FilmRating from '@components/FilmRating/FilmRating';
import FilmMeta from '@components/FilmMeta/FilmMeta';
import cn from "classnames";

type FilmInfoProps = {
    className?: string;
    film: Film;
};

const FilmInfo = ({ film, className }: FilmInfoProps) => {
  return (
    <div className={cn(s.info, className)}>
      <div className={s.title}>
        <Text tag={'h2'}>{film.title}</Text>
        <FilmRating rating={film.rating} />
      </div>

      <FilmMeta
        releaseYear={film.releaseYear}
        categoryTitle={film.category.title}
        ageLimit={film.ageLimit}
        duration={film.duration}
      />

      <Text className={s.description}>{film.description}</Text>
    </div>
  );
};

export default FilmInfo;
