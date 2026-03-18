import {Button} from "@components/index";
import s from '../Card.module.scss';
import {observer} from "mobx-react-lite";

type Props = {
    trailerUrl: string;
    actionFavorites: () => void;
    buttonText: string;
    consists: boolean;
    onWatchTrailer: (url: string) => void;
}

export const FilmCardActionSlot = observer(({
                                                trailerUrl,
                                                actionFavorites,
                                                buttonText,
                                                consists,
                                                onWatchTrailer
                                            }: Props) => {

    const handleFavoritesClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        actionFavorites();
    };

    const handleTrailerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onWatchTrailer(trailerUrl);
    };

    return (
        <div className={s.cardButton}>
            <Button
                className={s.buttons}
                onClick={handleFavoritesClick}
                outline={true}
            >
                {consists ? 'Убрать из избранного' : buttonText}
            </Button>
            <Button
                className={s.buttons}
                onClick={handleTrailerClick}
                outline={false}
            >
                Смотреть
            </Button>
        </div>
    );
});
