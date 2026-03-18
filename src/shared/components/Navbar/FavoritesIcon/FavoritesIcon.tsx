import s from "@components/Navbar/Navbar.module.scss";
import {BookmarkIcon, Button, Text} from "@components/index";
import React, {useState} from "react";
import Link from "next/link";
import ModalWindow from "@components/ModalWindow";
import LoginIcon from "@components/icons/LoginIcon";
import {useRouter} from "next/navigation";
import cn from "classnames";

type FavoritesIconProps = {
    actualPage?: string,
    iconSize: number,
    totalFavorites?: number
    authorized: boolean
    navbarIcon?: boolean
    onClick?: (e: React.MouseEvent) => void;
    className?: string
}

export const NonAuthorizedComponent = () =>
    <div className={s.modelRoot}>
        <Text view={'p-28'} weight={'bold'}>Вы не авторизированны!</Text>
        <Text view={'p-16'} weight={'medium'}>Нужно войти, чтобы добавлять и просматривать избранные фильмы</Text>
        <Link className={s.logoutBtn} href={'/login'}>
            <Button><LoginIcon/> Войти в аккаунт</Button>
        </Link>
    </div>

const FavoritesIcon: React.FC<FavoritesIconProps> = ({
                                                         actualPage,
                                                         iconSize,
                                                         totalFavorites,
                                                         navbarIcon = true,
                                                         authorized,
                                                         onClick,
                                                         className,
                                                     }) => {
    const color = actualPage === 'favorites' ? 'accent' : 'white'
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useRouter();

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            onClick(e);
        } else if (authorized) {
            navigate.push('/favorites');
        } else {
            setIsOpen(true);
        }
    };

    const icon = (
        <div className={cn(s.iconWrapper, className)}>
            {authorized && navbarIcon && (
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
        <div className={cn(s.iconWrapper, className)} onClick={handleClick}>
            <Text color={color} className={s.iconText}>{totalFavorites ? totalFavorites : ''}</Text>
            <BookmarkIcon
                color={color}
                iconType={'stroke'}
                className={s.icon}
                width={iconSize}
                height={iconSize}
            />
        </div>
    )
}

export default FavoritesIcon;
