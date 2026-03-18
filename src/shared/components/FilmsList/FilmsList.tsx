import s from './FilmsList.module.scss';
import { Card, Text} from '@components/index';
import type {Film} from '@shared-types/FilmType';
import React from "react";
import {useRouter} from "next/navigation";

type ListOfFilmsProps = {
    filmsList: Film[];
    actionCardSlot: (film: Film) => React.ReactNode;
    isLoading?: boolean;
    emptyText: string;
};

const FilmsList = ({
                       filmsList = [],
                       emptyText = 'Фильмов по вашему запросу не найдено, попробуйте еще',
                       isLoading = false,
                       actionCardSlot,
                   }: ListOfFilmsProps) => {
    const navigate = useRouter();
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
                    onClick={() => navigate.push(`/films/${film.documentId}`)}
                    key={film.documentId}
                    title={film.title}
                    subtitle={film.shortDescription}
                    image={film.gallery[0].url}
                    rating={film.rating}
                    releaseYear={film.releaseYear}
                    ageLimit={film.ageLimit}
                    category={film.category.title}
                    duration={film.duration}
                    actionSlot={actionCardSlot(film)}
                />
            ))}
        </div>
    );
};

export default FilmsList;
