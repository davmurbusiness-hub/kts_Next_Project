'use client'
import logo from '../../../../public/img.png';
import s from './Navbar.module.scss';

import cn from 'classnames';
import {BookmarkIcon, BurgerNavbar, UserIcon} from "@components/";
import React from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";

export type NavbarProps = {
  actualPage: string;
};



const pages = [
  { name: 'films', value: 'Фильмы' },
  { name: 'trends', value: 'Новинки' },
  { name: 'collections', value: 'Подборки' },
];

const iconSize = 30;

const Navbar: React.FC<NavbarProps> = ({ actualPage, ...props }) => {
  const navigate = useRouter();

  return (
    <div>
      <div className={s.navbar} {...props}>
        <Image
          className={s.image}
          onClick={() => {
            navigate.push('/');
          }}
          src={logo}
          alt={'logo'}
        />
        <div className={s.pages}>
          {pages.map((page) => (
            <p
              onClick={() => {
                navigate.push(`/${page.name}`);
              }}
              key={page.name}
              className={cn(s.page, actualPage === page.name ? s.selected : undefined)}
            >
              {page.value}
            </p>
          ))}
        </div>
        <div className={s.icons}>
          <BookmarkIcon
            onClick={() => {
              navigate.push('/favorites');
            }}
            color={actualPage === 'favorites' ? 'accent' : 'white'}
            iconType={'stroke'}
            className={s.icon}
            width={iconSize}
            height={iconSize}
          />
          <UserIcon
            onClick={() => {
              navigate.push('/login');
            }}
            className={s.icon}
            color={actualPage === 'login' || actualPage === 'registration' ? 'accent' : 'white'}
            width={iconSize}
            height={iconSize}
          />
        </div>
      </div>
      <BurgerNavbar className={s.burgerMenu} pages={pages} actualPage={actualPage} />
    </div>
  );
};

export default Navbar;
