"use client";

import { useState } from "react";
import Link from "next/link";
import {Button, ExitIcon, Text, UserIcon} from "@components/index";
import ModalWindow from "@components/ModalWindow";
import s from "../Navbar.module.scss";
import {useRootStore} from "@providers/StoreProvider";

type AuthorizedProps = {
    authorized: boolean;
    username: string;
};

type AccountIconProps = {
    actualPage: string;
    iconSize: number;
} & (AuthorizedProps);

const AccountIcon: React.FC<AccountIconProps> = ({
                                                     actualPage,
                                                     iconSize,
                                                     authorized,
                                                     username,
                                                 }) => {
    const rootStore = useRootStore()
    const [isOpen, setIsOpen] = useState(false);

    const color =
        actualPage === "login" || actualPage === "registration"
            ? "accent"
            : "white";


    const icon = (
        <div className={s.iconWrapper}>
            {authorized && (
                <Text color={color} className={s.iconText}>
                    {username}
                </Text>
            )}

            <UserIcon
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
            <Link href="/login" className={s.iconWrapper}>
                {icon}
            </Link>
        );
    }

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
                <div className={s.avatar}>{username[0].toUpperCase()}</div>
                <p className={s.username}>{username}</p>

                <div className={s.divider}/>

                <Button className={s.logoutBtn} onClick={() => rootStore.auth.logout()}>
                    <ExitIcon/> Выйти из аккаунта
                </Button>
            </ModalWindow>
        </>
    );
};

export default AccountIcon;
