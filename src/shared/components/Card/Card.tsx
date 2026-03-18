'use client'
import {Text} from '@components/index';
import React from 'react';
import s from './Card.module.scss';
import cn from 'classnames';
import Image from "next/image";
import FilmRating from "@components/FilmRating";
import FilmDuration from "@components/FilmDuration";
import FilmMeta from "@components/FilmMeta";

type Viewport = {
    width: string;
    height: string;
};
export type CardProps = {
    /** Дополнительный classname */
    className?: string;
    /** URL изображения */
    image: string;
    /** Слот над заголовком */
    captionSlot?: React.ReactNode;
    /** Заголовок карточки */
    title: React.ReactNode;
    /** Описание карточки */
    subtitle: React.ReactNode;
    /** Содержимое карточки (футер/боковая часть), может быть пустым */
    actionFavorites?: () => void;
    /** Клик на карточку */
    onClick?: React.MouseEventHandler;
    /** Слот для действия */
    actionSlot: React.ReactNode;
    viewPort?: Viewport;
    rating: number;
    duration: number;
    releaseYear: number;
    category: string;
    ageLimit: number;
};

const Card: React.FC<CardProps> = ({
                                       className = '',
                                       image,
                                       title,
                                       subtitle,
                                       onClick,
                                       actionSlot,
                                       duration,
                                       rating,
                                       releaseYear,
                                       category,
                                       ageLimit,
                                       ...rest
                                   }) => {

    return (
        <div className={cn(className, s.card)} onClick={onClick} {...rest}>
            <div className={s.cardImage}>
                <FilmRating className={s.rating} rating={rating}/>

                <FilmDuration duration={duration}/>
                <Image className={s.img} src={image} fill alt={String(title)} sizes="(max-width: 768px) 100vw, 33vw"/>
            </div>
            <div className={s.cardContent}>
                <div className={s.cardText}>
                    <div className={s.captionSlot}>
                        <FilmMeta releaseYear={releaseYear} categoryTitle={category} ageLimit={ageLimit}/>
                    </div>
                    <Text className={s.title} view={'p-20'} weight={'medium'} maxLines={2}>
                        {title}
                    </Text>
                    <Text className={s.subtitle} color={'secondary'} view={'p-16'} maxLines={3}>
                        {subtitle}
                    </Text>
                </div>
                <div className={s.cardBottom}>
                  {actionSlot}
                </div>
            </div>
        </div>
    );
};

export default Card;
