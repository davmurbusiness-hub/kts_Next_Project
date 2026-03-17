'use client';
import { Button, Input, Navbar, Text } from '@components/index';
import { useLocalStore } from '@hooks/useLocalStore';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useRootStore } from '@providers/StoreProvider';
import RegistrationStore from '@store/localStores/AuthorizationStore/RegistrationStore/RegistrationStore';
import s from './RegistrationPage.module.scss';
import Link from "next/link";
import {useToast} from "@providers/Toast/ToastProvider";

const RegistrationPage = observer(() => {
  const navigate = useRouter();
  const rootStore = useRootStore();
  const toast = useToast();

  const registrationStore = useLocalStore(() => new RegistrationStore(rootStore, navigate, toast));

  return (
      <div className={s.root}>
        <Navbar actualPage={'login'} />
        <div className={s.container}>
          <Text className={s.nameText} tag={'h1'}>
            Регистрация
          </Text>
          {registrationStore.message && (
              <Text color={'accent'} view={'p-14'}>
                {registrationStore.message}
              </Text>
          )}
          <Input
              placeholder={'Почта'}
              value={registrationStore.login}
              onChange={registrationStore.setLoginValue}
          />
          <Input
              type={'password'}
              placeholder={'Пароль'}
              value={registrationStore.password}
              onChange={registrationStore.setPasswordValue}
          />
          <Input
              type={'password'}
              placeholder={'Повторите пароль'}
              value={registrationStore.passwordSecond}
              onChange={registrationStore.setPasswordSecondValue}
          />
          <Button onClick={registrationStore.register}>Зарегистрироваться</Button>
            <Link className={s.regText} href={'/login'}>
                Уже есть аккаунт? Войдите
            </Link>
        </div>
      </div>
  );
});

export default RegistrationPage;
