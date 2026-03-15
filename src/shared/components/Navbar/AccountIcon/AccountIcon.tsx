import {Text, UserIcon} from "@components/index";
import s from "@components/Navbar/Navbar.module.scss";
import React from "react";
import Link from "next/link";

type AccountIconProps = {
    actualPage: string,
    iconSize: number,
    username?: string
}


const AccountIcon: React.FC<AccountIconProps> = ({actualPage, iconSize, username}) => {
    const color = actualPage === 'login' || actualPage === 'registration' ? 'accent' : 'white'

    return (
        <Link href="/login" className={s.iconWrapper}>
            <Text color={color} className={s.iconText}>{username ?? ''}</Text>
            <UserIcon
                className={s.icon}
                iconType={username ? 'fill' : 'stroke'}
                color={actualPage === 'login' || actualPage === 'registration' ? 'accent' : 'white'}
                width={iconSize}
                height={iconSize}
            />
        </Link>
    )
}

export default AccountIcon;
