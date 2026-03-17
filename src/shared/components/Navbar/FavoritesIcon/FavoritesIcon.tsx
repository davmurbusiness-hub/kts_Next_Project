import s from "@components/Navbar/Navbar.module.scss";
import {BookmarkIcon, Button, Text} from "@components/index";
import React, {useState} from "react";
import Link from "next/link";
import ModalWindow from "@components/ModalWindow";
import LoginIcon from "@components/icons/LoginIcon";

type FavoritesIconProps = {
    actualPage: string,
    iconSize: number,
    totalFavorites?: number
    authorized: boolean
}


export const NonAuthorizedComponent = () =>
    <div className={s.modelRoot}>
        <Text view={'p-28'} weight={'bold'}>Вы не авторизированны!</Text>
        <Text view={'p-16'} weight={'medium'}>Нужно войти, чтобы добавлять и просматривать избранные фильмы</Text>
        <Link className={s.logoutBtn} href={'/login'}>
            <Button><LoginIcon/> Войти в аккаунт</Button>
        </Link>
    </div>




const FavoritesIcon: React.FC<FavoritesIconProps> = ({actualPage, iconSize, totalFavorites, authorized}) => {
    const color = actualPage === 'favorites' ? 'accent' : 'white'
    const [isOpen, setIsOpen] = useState(false);

    const icon = (
        <div className={s.iconWrapper}>
            {authorized && (
                <Text color={color} className={s.iconText}>{totalFavorites}</Text>

            )}
            <BookmarkIcon
                className={s.icon}
                iconType={authorized ? "fill" : "stroke"}
                color={color}
                width={iconSize}
                height={iconSize}
            />
        </div>
    );

    if (!authorized) {
        return (
            <>
                <div
                    onClick={() => setIsOpen(true)}
                    aria-haspopup="dialog"
                >
                    {icon}
                </div>

                <ModalWindow
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                >
                    <NonAuthorizedComponent/>
                </ModalWindow>
            </>
        );
    }

    return (
        <Link href={'/favorites'} className={s.iconWrapper}>
            <Text color={color} className={s.iconText}>{totalFavorites ? totalFavorites : ''}</Text>
            <BookmarkIcon
                color={color}
                iconType={'stroke'}
                className={s.icon}
                width={iconSize}
                height={iconSize}
            />
        </Link>

    )
}
export default FavoritesIcon;
