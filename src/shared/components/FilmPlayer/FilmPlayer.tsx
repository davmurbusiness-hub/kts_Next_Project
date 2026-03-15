import s from './FilmPlayer.module.scss';

type FilmPlayerProps = {
  trailerUrl: string;
};

const FilmPlayer = ({ trailerUrl }: FilmPlayerProps) => {
  return (
    <iframe
      className={s.iframe}
      src={`${trailerUrl}?autoplay=1&loop=1&muted=1`}
      allow="autoplay; fullscreen"
      allowFullScreen
    />
  );
};

export default FilmPlayer;
