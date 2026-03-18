'use client';
import s from './FilmPage.module.scss';
import { BackButton, FilmInfo, FilmPlayer, Loader, Navbar } from '@components/index';
import { Meta } from '@utils/meta';
import { observer } from 'mobx-react-lite';
import FilmPageStore from '@store/localStores/FilmPageStore';
import { useLocalStore } from '@hooks/useLocalStore';
import type { Film } from '@/shared/types/FilmType';
import FilmGallery from './components/FilmGallery/FilmGallery';

type FilmPageProps = {
    documentId: string;
    initialFilm: Film;
};

const FilmPage = observer(({ documentId, initialFilm }: FilmPageProps) => {
    const filmStore = useLocalStore(
        () => new FilmPageStore(documentId, { film: initialFilm }),
        [documentId]
    );

    const isReady = filmStore.meta === Meta.success && filmStore.film;

    return (
        <div className={s.filmPage}>
            <Navbar actualPage={'films'} />
            <BackButton />
            {!isReady ? (
                <Loader size={'l'} className={s.loader} />
            ) : (
                <div className={s.content}>
                    <div className={s.film}>
                        <div className={s.trailer}>
                            <FilmPlayer autoPlay={true} trailerUrl={filmStore.film!.trailerUrl} />
                        </div>
                        <FilmInfo film={filmStore.film!} />
                    </div>
                    <FilmGallery gallery={filmStore.film!.gallery} />
                </div>
            )}
        </div>
    );
});

export default FilmPage;
