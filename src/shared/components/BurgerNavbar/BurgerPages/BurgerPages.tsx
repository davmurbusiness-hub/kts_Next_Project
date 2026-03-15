import s from "@components/Navbar/Navbar.module.scss";
import React from "react";
import cn from "classnames";
import {useRouter} from "next/navigation";
import type {Page} from "@components/Navbar";

type BurgerPagesProps = {
    pages: Page[];
    actualPage: string;
    onItemClick?: () => void;
};

type BurgerPageItemProps = {
    page: Page;
    actualPage: string;
    onItemClick?: () => void;
};

const BurgerPageItem: React.FC<BurgerPageItemProps> = React.memo(({ page, actualPage, onItemClick }) => {
    const navigate = useRouter();

    const handleClick = React.useCallback(() => {
        navigate.push(`/${page.name}`);
        onItemClick?.();
    }, [navigate, page.name, onItemClick]);

    const isSelected = actualPage === page.name;

    return (
        <p
            className={cn(s.menuItem, isSelected && s.selected)}
            onClick={handleClick}
        >
            {page.value}
        </p>
    );
});


const BurgerPages: React.FC<BurgerPagesProps> = ({ pages, actualPage, onItemClick }) => {
    return (
        <>
            {pages.map((page) => (
                <BurgerPageItem
                    key={page.name}
                    page={page}
                    actualPage={actualPage}
                    onItemClick={onItemClick}
                />
            ))}
        </>
    );
};

export default BurgerPages;
