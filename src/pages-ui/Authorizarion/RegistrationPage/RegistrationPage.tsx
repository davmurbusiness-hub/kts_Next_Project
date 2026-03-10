'use client'
import { Button, Input, Navbar, Text } from '@components/index';
import { useCallback, useState } from 'react';
import s from './RegistrationPage.module.scss';
import {useRouter} from "next/navigation";
import {useRootStore} from "@providers/StoreProvider";

const RegistrationPage = () => {
  const [login, setLogin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordSecond, setPasswordSecond] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const rootStore = useRootStore();





  const navigate = useRouter();

  const handleSendInfo = useCallback(async () => {
    if (login === '') {
      setMessage('Заполните логин');
      return;
    }
    if (password === '') {
      setMessage('Заполните пароль');
      return;
    }
    if (passwordSecond !== password) {
      setMessage('Пароли не совпадают');
      return;
    }
    const result = await rootStore.auth.registerReq(login, password);
    if (result.success) {
      setMessage(result.message);
      setTimeout(() => navigate.push('/films'), 1000);
    } else {
      setMessage(result.message);
    }
  }, [login, navigate, password, passwordSecond, rootStore.auth]);

  return (
    <div className={s.root}>
      <Navbar actualPage={'login'} />
      <div className={s.container}>
        <Text className={s.nameText} tag={'h1'}>
          Регистрация
        </Text>
        {message && (
          <Text color={'accent'} view={'p-14'}>
            {message}
          </Text>
        )}
        <Input placeholder={'Логин'} value={login} onChange={setLogin} />
        <Input type={'password'} placeholder={'Пароль'} value={password} onChange={setPassword} />
        <Input
          type={'password'}
          placeholder={'Повторите пароль'}
          value={passwordSecond}
          onChange={setPasswordSecond}
        />
        <Button onClick={handleSendInfo}>Зарегистрироваться</Button>
        <span className={s.regText} onClick={() => navigate.push('/login')}>
          Логин
        </span>
      </div>
    </div>
  );
};

export default RegistrationPage;
