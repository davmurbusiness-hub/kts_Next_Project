import { Text } from '@components/index';
import s from './PageText.module.scss';

export type PageTextProps = {
  title: string;
  description: string;
};

const PageText = ({ title = '', description = '' }: PageTextProps) => {
  return (
    <div className={s.frameText}>
      <Text tag={'h1'}>{title}</Text>
      <Text view={'p-20'} color={'secondary'}>
        {description}
      </Text>
    </div>
  );
};

export default PageText;
