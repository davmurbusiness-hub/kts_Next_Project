import s from "@components/Navbar/Navbar.module.scss";
import {BookmarkIcon, Text} from "@components/index";
import React from "react";
import Link from "next/link";

type FavoritesIconProps = {
    actualPage: string,
    iconSize: number,
    totalFavorites?: number
}


const FavoritesIcon: React.FC<FavoritesIconProps> = ({actualPage, iconSize, totalFavorites}) => {
    const color = actualPage === 'favorites' ? 'accent' : 'white'

    return (
        <Link href={'/favorites'}  className={s.iconWrapper}>
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
