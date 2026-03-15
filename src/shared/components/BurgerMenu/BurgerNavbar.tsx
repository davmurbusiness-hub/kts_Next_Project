'use client'
import cn from 'classnames';
import s from './BurgerNavbar.module.scss';
import logo from '../../../../public/img.png';
import * as React from 'react';
import {BookmarkIcon, UserIcon} from '../icons';
import {useRouter} from "next/navigation";
import Image from "next/image";

export type Page = {
  name: string;
  value: string;
};

export type BurgerNavbarProps = {
  className?: string;
  pages: Page[];
  actualPage: string;
};

const iconSize = 30;

const BurgerNavbar: React.FC<BurgerNavbarProps> = ({ pages, actualPage, className }) => {
  const navigate = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const handlePageClick = () => {
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <div className={s.navbar}>
        <button className={s.burgerButton} onClick={() => setIsOpen((prev) => !prev)}>
          <span />
          <span />
          <span />
        </button>

        <Image className={s.logo} src={logo} alt="logo" onClick={() => navigate.push('/')} />

        <div className={s.icons}>
          <BookmarkIcon
            className={s.icon}
            iconType={'stroke'}
            onClick={() => {
              navigate.push('/favorites');
            }}
            width={iconSize}
            height={iconSize}
          />
          <UserIcon
            className={s.icon}
            onClick={() => {
              navigate.push('/login');
            }}
            width={iconSize}
            height={iconSize}
          />
        </div>
      </div>

      {isOpen && <div className={s.overlay} onClick={() => setIsOpen(false)} />}

      <div className={cn(s.sideMenu, isOpen && s.open)}>
        {pages.map((page) => (
          <p
            key={page.name}
            className={cn(s.menuItem, actualPage === page.name && s.selected)}
            onClick={() => handlePageClick()}
          >
            {page.value}
          </p>
        ))}
      </div>
    </div>
  );
};

export default BurgerNavbar;
