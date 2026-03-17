import s from "@components/Navbar/Navbar.module.scss";
import React from "react";
import cn from "classnames";
import {useRouter} from "next/navigation";
import type {Page} from "@components/Navbar";


const NavBarPageItem = React.memo(({ page, actualPage }: { page: Page; actualPage: string }) => {
    const navigate = useRouter();

    const handleClick = React.useCallback(() => {
        navigate.push(`/${page.name}`);
    }, [navigate, page.name]);

    const isSelected = actualPage === page.name;

    return (
        <p
            onClick={handleClick}
            className={cn(s.page, isSelected && s.selected)}
        >
            {page.value}
        </p>
    );
});


const NavBarPages = ({pages, actualPage}: {pages: Page[], actualPage: string}) => {
    return (
        <div className={s.pages}>
            {pages.map((page) => (
                <NavBarPageItem
                    key={page.name}
                    page={page}
                    actualPage={actualPage}
                />
            ))}
        </div>
    )
};

export default NavBarPages;
