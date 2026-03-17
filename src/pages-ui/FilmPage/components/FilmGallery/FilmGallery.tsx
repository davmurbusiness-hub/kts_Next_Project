import s from './FilmGallery.module.scss';
import { Text } from '@components/index';
import type { Gallery } from '@shared-types/GalleryType';
import Image from 'next/image';

type FilmGalleryProps = {
  gallery: Gallery[];
};

const FilmGallery = ({ gallery }: FilmGalleryProps) => {
  return (
    <div className={s.gallery}>
      <Text view={'title'}>Изображения</Text>
      <div className={s.images}>
        {gallery.map((item: Gallery) => (
          <Image
            key={item.id}
            width={245}
            height={138}
            src={item.formats.thumbnail.url}
            alt=""
          />
        ))}
      </div>
    </div>
  );
};

export default FilmGallery;
