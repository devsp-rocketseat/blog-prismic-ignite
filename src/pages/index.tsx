import Head from 'next/head';
import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';

import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Posts | Blog Prismic</title>
      </Head>

      <Header />

      <main className={styles.container}>
        <a className={styles.contentPost}>
          <h1 className={commonStyles.title}>Como utilizar Hooks</h1>

          <h2 className={commonStyles.subtitle}>
            Pensando em sincronização em vez de ciclos de vida.
          </h2>

          <div className={styles.containerInfo}>
            <div>
              <FiCalendar />
              <span className={commonStyles.info}>15 Mar 2021</span>
            </div>

            <div>
              <FiUser />
              <span className={commonStyles.info}>Joseph Oliveira</span>
            </div>
          </div>
        </a>

        <a className={styles.contentPost}>
          <h1 className={commonStyles.title}>Como utilizar Hooks</h1>

          <h2 className={commonStyles.subtitle}>
            Pensando em sincronização em vez de ciclos de vida.
          </h2>

          <div className={styles.containerInfo}>
            <div>
              <FiCalendar />
              <span className={commonStyles.info}>15 Mar 2021</span>
            </div>

            <div>
              <FiUser />
              <span className={commonStyles.info}>Joseph Oliveira</span>
            </div>
          </div>
        </a>
      </main>

      <footer className={styles.footer}>
        <button type="button">Carregar mais posts</button>
      </footer>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
