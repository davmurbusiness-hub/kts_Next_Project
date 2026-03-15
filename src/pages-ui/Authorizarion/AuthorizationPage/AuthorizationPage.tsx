'use client';
import { Button, Input, Navbar, Text } from '@components/index';
import { useLocalStore } from '@hooks/useLocalStore';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/navigation';
import { useRootStore } from '@providers/StoreProvider';
import LoginStore from '@store/localStores/AuthorizationStore/LoginStore';
import s from './AuthorizationPage.module.scss';

const AuthorizationPage = observer(() => {
  const navigate = useRouter();
  const rootStore = useRootStore();

  const loginStore = useLocalStore(() => new LoginStore(rootStore, navigate));

  return (
      <div className={s.root}>
        <Navbar actualPage={'login'} />
        <div className={s.container}>
          <Text tag={'h1'} className={s.nameText}>
            Вход
          </Text>
          {loginStore.message && (
              <Text color={'accent'} view={'p-14'}>
                {loginStore.message}
              </Text>
          )}
          <Input
              placeholder={'Логин'}
              value={loginStore.login}
              onChange={loginStore.setLoginValue}
          />
          <Input
              type={'password'}
              placeholder={'Пароль'}
              value={loginStore.password}
              onChange={loginStore.setPasswordValue}
          />
          <Button onClick={loginStore.validation}>Войти</Button>
          <span className={s.regText} onClick={() => navigate.push('/registration')}>
          Еще нет аккаунта? Зарегистрироваться
        </span>
        </div>
      </div>
  );
});

export default AuthorizationPage;
