'use client';
import s from './BackButton.module.scss';
import { ArrowRightIcon, Text } from '@components/index';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const navigate = useRouter();

  return (
    <div className={s.back} onClick={() => navigate.back()}>
      <ArrowRightIcon width={32} height={32} className={s.icon} />
      <Text view={'p-20'}>Назад</Text>
    </div>
  );
};

export default BackButton;
