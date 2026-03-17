import s from './FilmMeta.module.scss';
type FilmMetaProps = {
  releaseYear: number | string;
  categoryTitle: string;
  ageLimit: number | string;
  duration?: number;
};

const FilmMeta = ({ releaseYear, categoryTitle, ageLimit, duration }: FilmMetaProps) => {
    const hours = duration ? Math.trunc(duration / 60) : 0;
    const minutes = duration ? duration % 60 : 0;
    return (
    <div className={s.captionSlot}>
      <p>{releaseYear}</p>
      <span>•</span>
      <p>{categoryTitle}</p>
      <span>•</span>
      <p>{ageLimit}+</p>
        {duration && (<span>•</span>)}
        {duration && (<div>{hours}ч {minutes}м</div>)}
    </div>
  );
};

export default FilmMeta;
