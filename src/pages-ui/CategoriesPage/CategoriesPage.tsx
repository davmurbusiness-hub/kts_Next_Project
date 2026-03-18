'use client';

import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { motion, AnimatePresence, cubicBezier } from 'framer-motion';
import {CloseIcon, Navbar, PageText} from '@components/index';
import type { Category } from '@shared-types/CategoryType';
import s from './CategoriesPage.module.scss';
import ApiStore from '@api/ApiStore';
import CategoriesStore from '@store/localStores/CategoriesPageStore/CategoriesPageStore';
import {useLocalStore} from "@hooks/useLocalStore";
import {useRouter} from "next/navigation";


type CategoriesPageProps = {
    categories: Array<{ category: Category; url: string }>;
};


const easeOut = cubicBezier(0.22, 1, 0.36, 1);
const easeIn  = cubicBezier(0.4, 0, 1, 1);

const panelVariants = {
    hidden: { opacity: 0, y: '100%' },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: easeOut },
    },
    exit: {
        opacity: 0,
        y: '100%',
        transition: { duration: 0.35, ease: easeIn },
    },
};

const filmItemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: 0.1 + i * 0.055, duration: 0.35, ease: easeOut },
    }),
};

const cardVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.025, transition: { duration: 0.2 } },
    tap: { scale: 0.97 },
};


const CategoriesPage: React.FC<CategoriesPageProps> = observer(({ categories }) => {
    const navigate = useRouter();
    const store = useLocalStore(
        () => new CategoriesStore(new ApiStore('https://front-school-strapi.ktsdev.ru'))
    );

    const activeItem = categories.find((c) => c.category.id === store.activeId);


    useEffect(() => {
        if (store.activeId !== null) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [store.activeId]);

    return (
        <div className={s.page}>
            <Navbar actualPage="categories" />

            <div className={s.container}>
                <PageText
                    title="Фильмы по категориям"
                    description="Здесь вы можете найти фильмы себе по вкусу"
                />

                <div className={s.grid}>
                    {categories.map((item, index) => (
                        <motion.div
                            key={item.category.id ?? index}
                            layoutId={`category-card-${item.category.id}`}
                            className={s.card}
                            variants={cardVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onHoverStart={() =>
                                item.category.id && store.prefetch(item.category.id)
                            }
                            onClick={() =>
                                item.category.id && store.open(item.category.id)
                            }
                        >
                            <div className={s.cardImageWrap}>
                                <motion.img
                                    src={item.url}
                                    alt={item.category.title}
                                    className={s.cardImage}
                                    layoutId={`category-img-${item.category.id}`}
                                />
                            </div>

                            <motion.div
                                className={s.cardInfo}
                                layoutId={`category-info-${item.category.id}`}
                            >
                                <h2 className={s.cardTitle}>{item.category.title}</h2>
                                <p className={s.cardDesc}>{item.category.description}</p>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {store.activeId !== null && activeItem && (
                    <motion.div
                        className={s.panel}
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className={s.panelHeader}>
                            <motion.img
                                src={activeItem.url}
                                alt={activeItem.category.title}
                                className={s.panelBanner}
                                layoutId={`category-img-${store.activeId}`}
                            />

                            <div className={s.panelHeaderContent}>
                                <motion.div layoutId={`category-info-${store.activeId}`}>
                                    <h1 className={s.panelTitle}>
                                        {activeItem.category.title}
                                    </h1>
                                    <p className={s.panelDesc}>
                                        {activeItem.category.description}
                                    </p>
                                </motion.div>
                            </div>


                            <button
                                className={s.closeBtn}
                                onClick={store.close}
                                aria-label="Закрыть"
                            >
                                <CloseIcon className={s.check} />
                            </button>
                        </div>

                        <div className={s.filmList}>
                            {store.loading && (
                                <motion.div
                                    className={s.state}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <span className={s.spinner} />
                                    Загружаем фильмы…
                                </motion.div>
                            )}

                            {store.error && !store.loading && (
                                <motion.div
                                    className={s.state}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    Не удалось загрузить фильмы
                                </motion.div>
                            )}

                            {!store.loading && !store.error && store.films.length === 0 && (
                                <motion.div
                                    className={s.state}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    Фильмов пока нет
                                </motion.div>
                            )}

                            {!store.loading &&
                                store.films.map((film, i) => (
                                    <motion.div
                                        onClick={() => navigate.push(`films/${film.documentId}`)}
                                        key={film.id}
                                        className={s.filmItem}
                                        custom={i}
                                        variants={filmItemVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {film.poster?.url && (
                                            <img
                                                src={film.poster.url}
                                                alt={film.title}
                                                className={s.filmPoster}
                                            />
                                        )}
                                        <span className={s.filmIndex}>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <span className={s.filmTitle}>{film.title}</span>
                                    </motion.div>
                                ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

export default CategoriesPage;
