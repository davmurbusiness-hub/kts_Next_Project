import s from './FilmRating.module.scss';
import cn from 'classnames';
import { StarIcon, Text } from '@components/index';

type FilmRatingProps = {
  rating: number | string;
  className?: string;
};

const FilmRating = ({ rating, className }: FilmRatingProps) => {
  return (
    <span className={cn(s.cardImageInf, className)}>
      <Text view={'p-20'} weight={'medium'}>
        {rating}
      </Text>
      <StarIcon iconType={'fill'} color={'yellow'} />
    </span>
  );
};

export default FilmRating;
