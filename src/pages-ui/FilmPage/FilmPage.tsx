'use client';
import s from './FilmPage.module.scss';
import cn from 'classnames';
import type { Gallery } from '@shared-types/GalleryType';
import { ArrowRightIcon, Loader, Navbar, StarIcon, Text } from '@components/index';
import { Meta } from '@utils/meta';
import { observer } from 'mobx-react-lite';
import FilmPageStore from '@store/localStores/FilmPageStore';
import { useLocalStore } from '@hooks/useLocalStore';
import {useRouter} from "next/navigation";
import type { Film } from '@/shared/types/FilmType';


type FilmPageProps = {
    documentId: string;
    initialFilm: Film;
};

const FilmPage = ({ documentId, initialFilm }: FilmPageProps) => {
    const navigate = useRouter();
    const filmStore = useLocalStore(
        () => new FilmPageStore(documentId, { film: initialFilm })
    );



  return (
    <div className={s.filmPage}>
      <Navbar actualPage={'films'} />
      <div
        className={s.back}
        onClick={() => {
          navigate.back()
        }}
      >
        <ArrowRightIcon width={32} height={32} className={s.icon} />
        <Text view={'p-20'}>Назад</Text>
      </div>

      {filmStore.meta !== Meta.success ? (
        <Loader size={'l'} className={s.loader} />
      ) : (
        <div className={s.content}>
          <div className={s.film}>
            <iframe
                className={s.iframe}
              src={filmStore.film?.trailerUrl + '?autoplay=1&loop=1&muted=1'}
              allow="autoplay; fullscreen"
              allowFullScreen
            />

            <div className={s.info}>
              <div className={s.title}>
                <Text tag={'h2'}>{filmStore.film?.title}</Text>
                <span className={cn(s.cardImageInf, s.rating)}>
                  <Text view={'p-20'} weight={'medium'}>
                    {filmStore.film?.rating}
                  </Text>
                  <StarIcon iconType={'fill'} color={'yellow'} />
                </span>
              </div>
              <div className={s.captionSlot}>
                <p>{filmStore.film?.releaseYear}</p>
                <span>•</span>
                <p>{filmStore.film?.category.title}</p>
                <span>•</span>
                <p>{filmStore.film?.ageLimit}+</p>
                <span>•</span>
                <span>
                  {filmStore.film && Math.trunc(filmStore.film.duration / 60)}ч{' '}
                  {filmStore.film && filmStore.film.duration % 60}
                </span>
              </div>
              <Text className={s.description}>{filmStore.film?.description}</Text>
            </div>
          </div>
          <div className={s.gallery}>
            <Text view={'title'}>Изображения</Text>
            <div>
              {filmStore.film?.gallery.map((item: Gallery) => (
                <img src={item.formats.thumbnail.url} key={item.id} alt="" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default observer(FilmPage);
