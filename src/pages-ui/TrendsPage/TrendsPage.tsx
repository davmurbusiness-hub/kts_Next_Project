import type { Film } from "@shared-types/FilmType";
import {FilmInfo, FilmPlayer, Navbar, PageText} from "@components/index";
import s from './TrendsPage.module.scss';
import Link from "next/link";

const TrendsPage = ({ filmsList }: { filmsList: Film[] }) => {
  return (
    <div className={s.page}>
      <Navbar actualPage={'trends'} />
      <div className={s.container}>
          <PageText title={"Новинки"} description={"Самые популярные и обсуждаемые фильмы за последнее время"}/>
        {filmsList.map((film: Film) => (
          <div className={s.card} key={film.id}>
            <div className={s.imageWrapper}>
                <FilmPlayer autoPlay={false} trailerUrl={film.trailerUrl}/>
            </div>
              <Link className={s.cardText} href={`/films/${film.documentId}`}>
                  <FilmInfo  film={film} />
              </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendsPage;
