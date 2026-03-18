'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import s from './FilmGallery.module.scss';
import {ArrowRightIcon, Text} from '@components/index';
import type { Gallery } from '@shared-types/GalleryType';

type FilmGalleryProps = {
    gallery: Gallery[];
};

const FilmGallery = ({ gallery }: FilmGalleryProps) => {
    const trackRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (!trackRef.current) return;

        // Measure the first item's actual rendered width + gap so the scroll
        // distance is always exactly one card — regardless of breakpoint.
        const firstItem = trackRef.current.querySelector<HTMLElement>(`.${s.item}`);
        const itemWidth = firstItem ? firstItem.offsetWidth : 560;
        const gap = parseInt(getComputedStyle(trackRef.current).gap) || 16;
        const scrollBy = itemWidth + gap;

        trackRef.current.scrollBy({
            left: direction === 'right' ? scrollBy : -scrollBy,
            behavior: 'smooth',
        });
    };

    return (
        <div className={s.gallery}>
            <div className={s.header}>
                <Text tag={'h1'}>Изображения</Text>
                <div className={s.controls}>
                    <button className={s.btn} onClick={() => scroll('left')} aria-label="Назад">
                        <ArrowRightIcon style={{ transform: "scaleX(-1)" }} width={20} height={20} />
                    </button>
                    <button className={s.btn} onClick={() => scroll('right')} aria-label="Вперёд">
                        <ArrowRightIcon width={20} height={20} />
                    </button>
                </div>
            </div>

            <div className={s.track} ref={trackRef}>
                {gallery.map((item: Gallery, index: number) => (
                    <motion.div
                        key={item.id}
                        className={s.item}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.07, duration: 0.4 }}
                    >
                        <Image
                            src={item.formats.medium.url}
                            alt={'Изображения из фильма'}
                            width={560}
                            height={315}
                            className={s.image}
                            draggable={false}
                            sizes="(max-width: 767px) 80vw, (max-width: 1023px) 60vw, 560px"
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FilmGallery;
