import s from './FilmDuration.module.scss';
import cn from 'classnames';

type FilmDurationProps = {
  duration: number;
  className?: string;
};

const FilmDuration = ({ duration, className }: FilmDurationProps) => {
  const hours = Math.trunc(duration / 60);
  const minutes = duration % 60;

  return (
    <span className={cn(s.cardImageInf, s.duration, className)}>
      {hours}ч {minutes}м
    </span>
  );
};

export default FilmDuration;
