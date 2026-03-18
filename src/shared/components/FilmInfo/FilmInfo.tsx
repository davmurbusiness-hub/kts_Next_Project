import s from './FilmInfo.module.scss';
import {CheckIcon, Text} from '@components/index';
import type { Film } from '@/shared/types/FilmType';
import FilmRating from '@components/FilmRating/FilmRating';
import FilmMeta from '@components/FilmMeta/FilmMeta';
import cn from "classnames";
import {useRootStore} from "@providers/StoreProvider";
import FavoritesIcon from '../Navbar/FavoritesIcon/FavoritesIcon';
import {observer} from "mobx-react-lite";

type FilmInfoProps = {
    className?: string;
    film: Film;
};

const FilmInfo = ({ film, className }: FilmInfoProps) => {
    const rootStore = useRootStore();

    const isFavorite = rootStore.auth.favorites.some(f => f.id === film.id);

    return (
        <div className={cn(s.info, className)}>
            <div className={s.title}>
                <Text tag={'h2'}>{film.title}</Text>

                <div className={s.ratingRow}>
                    <FilmRating rating={film.rating} />
                    {isFavorite ? (
                        <CheckIcon
                            className={cn(s.icon, s.check)}
                            width={30}
                            height={30}
                            onClick={() => rootStore.auth.removeFavorite(film)}
                        />
                    ) : (
                        <FavoritesIcon
                            className={cn(s.icon, s.favorite)}
                            onClick={() => rootStore.auth.addFavorite(film)}
                            navbarIcon={false}
                            iconSize={30}
                            authorized={rootStore.auth.authorized}
                        />
                    )}
                </div>
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

export default observer(FilmInfo);
