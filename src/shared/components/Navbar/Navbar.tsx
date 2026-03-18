'use client'
import logo from '../../../../public/img.png';
import s from './Navbar.module.scss';
import {BurgerNavbar} from "@components/index";
import React from "react";
import Image from "next/image";
import NavBarPages from "@components/Navbar/NavBarPages/NavBarPages";
import FavoritesIcon from "@components/Navbar/FavoritesIcon/FavoritesIcon";
import AccountIcon from "@components/Navbar/AccountIcon/AccountIcon";
import {useRootStore} from "@providers/StoreProvider";
import Link from 'next/link';
import {observer} from "mobx-react-lite";

export type NavbarProps = {
    actualPage: string;
};

export type Page = {
        name: string;
        value: string;
    }

const pages: Page[] = [
    {name: 'films', value: 'Фильмы'},
    {name: 'categories', value: 'Категории'},
];

const iconSize = 30;

const Navbar: React.FC<NavbarProps> = ({actualPage, ...props}) => {
    const rootStore = useRootStore();


    return (
        <div>
            <div className={s.navbar} {...props}>
                <Link href="/">
                    <Image
                        className={s.image}

                        src={logo}
                        alt={'logo'}
                    />
                </Link>
                <NavBarPages pages={pages} actualPage={actualPage}/>
                <div className={s.icons}>
                    <FavoritesIcon authorized={rootStore.auth.authorized} actualPage={actualPage} iconSize={iconSize} totalFavorites={rootStore.auth.favorites.length}/>
                    <AccountIcon authorized={rootStore.auth.authorized} actualPage={actualPage} iconSize={iconSize} username={rootStore.auth.login}/>
                </div>
            </div>
            <BurgerNavbar authorized={rootStore.auth.authorized} className={s.burgerMenu} pages={pages} actualPage={actualPage} totalFavorites={rootStore.auth.favorites.length} username={rootStore.auth.login}/>
        </div>
    );
};

export default observer(Navbar);
