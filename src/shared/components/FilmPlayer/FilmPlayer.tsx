import s from './FilmPlayer.module.scss';

type FilmPlayerProps = {
  autoPlay: boolean;
  trailerUrl: string;
};

const FilmPlayer = ({ trailerUrl, autoPlay = false }: FilmPlayerProps) => {
  const url = new URL(trailerUrl);
  if (autoPlay){ url.searchParams.set('autoplay', '1');}
  url.searchParams.set('loop', '1');
  url.searchParams.set('muted', '1');

  return (
      <iframe
          className={s.iframe}
          src={url.toString()}
          allow="autoplay; fullscreen"
          allowFullScreen
          title="Film trailer"
      />
  );
};

export default FilmPlayer;
