'use client'
import { Button, Input, Navbar, Text } from '@components/index';
import { useCallback, useState } from 'react';
import s from './AuthorizationPage.module.scss';
import {useRouter} from "next/navigation";
import {useRootStore} from "@providers/StoreProvider";

const AuthorizationPage = () => {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useRouter();
  const rootStore = useRootStore();






  const handleSendInfo = useCallback(async () => {
    if (login === '') {
      setMessage('Заполните логин');
      return;
    }
    if (password === '') {
      setMessage('Заполните пароль');
      return;
    }
    const result = await rootStore.auth.loginReq(login, password);
    if (result.success) {
      setMessage(result.message);
      setTimeout(() => navigate.push('/films'), 1000);
    } else {
      setMessage(result.message);
    }
  }, [login, navigate, password, rootStore.auth]);

  return (
    <div className={s.root}>
      <Navbar actualPage={'login'} />
      <div className={s.container}>
        <Text tag={'h1'} className={s.nameText}>
          Вход
        </Text>
        {message && (
          <Text color={'accent'} view={'p-14'}>
            {message}
          </Text>
        )}
        <Input placeholder={'Логин'} value={login} onChange={setLogin} />
        <Input type={'password'} placeholder={'Пароль'} value={password} onChange={setPassword} />
        <Button onClick={handleSendInfo}>Войти</Button>
        <span className={s.regText} onClick={() => navigate.push('/registration')}>
          Зарегистрироваться
        </span>
      </div>
    </div>
  );
};

export default AuthorizationPage;
