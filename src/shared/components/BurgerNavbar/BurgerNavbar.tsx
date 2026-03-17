'use client'
import cn from 'classnames';
import s from './BurgerNavbar.module.scss';
import logo from '../../../../public/img.png';
import * as React from 'react';
import {useRouter} from "next/navigation";
import Image from "next/image";
import type {Page} from "@components/Navbar";
import FavoritesIcon from "@components/Navbar/FavoritesIcon/FavoritesIcon";
import AccountIcon from "@components/Navbar/AccountIcon/AccountIcon";
import BurgerPages from "@components/BurgerNavbar/BurgerPages/BurgerPages";

type BurgerNavbarProps = {
  className?: string;
  pages: Page[];
  actualPage: string;
  username: string;
  totalFavorites?: number;
  authorized: boolean;
};

const iconSize = 30;

const BurgerNavbar: React.FC<BurgerNavbarProps> = ({ pages, actualPage, className, username, totalFavorites, authorized }) => {
  const navigate = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const handlePageClick = React.useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleMenu = React.useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);


  return (
    <div className={className}>
      <div className={s.navbar}>
        <button className={s.burgerButton} onClick={toggleMenu}>
          <span />
          <span />
          <span />
        </button>

        <Image className={s.logo} src={logo} alt="logo" onClick={() => navigate.push('/')} />

        <div className={s.icons}>
          <FavoritesIcon authorized={authorized} actualPage={actualPage} iconSize={iconSize} totalFavorites={totalFavorites} />
          <AccountIcon authorized={authorized} actualPage={actualPage} iconSize={iconSize} username={username} />
        </div>
      </div>

      {isOpen && <div className={s.overlay} onClick={() => setIsOpen(false)} />}

      <div className={cn(s.sideMenu, isOpen && s.open)}>
        <BurgerPages actualPage={actualPage} pages={pages} onItemClick={handlePageClick} />
      </div>
    </div>
  );
};

export default BurgerNavbar;
