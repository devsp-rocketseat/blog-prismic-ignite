import { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  const [arrayPosts, setArrayPosts] = useState(postsPagination.results);

  const handleMorePosts = async (): Promise<void> => {
    const response = await fetch(nextPage);
    const objResponse = await response.json();

    const posts = objResponse.results.map(post => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setNextPage(objResponse.next_page);
    setArrayPosts(oldValue => [...oldValue, ...posts]);
  };

  return (
    <>
      <Head>
        <title>Posts | Blog Prismic</title>
      </Head>

      <Header />

      <main className={styles.container}>
        {arrayPosts.map(post => (
          <Link key={post.uid} href={`post/${post.uid}`}>
            <a className={styles.contentPost}>
              <h1 className={commonStyles.title}>{post.data.title}</h1>

              <h2 className={commonStyles.subtitle}>{post.data.subtitle}</h2>

              <div className={commonStyles.containerInfo}>
                <div>
                  <FiCalendar />
                  <span className={commonStyles.info}>
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      { locale: ptBR }
                    )}
                  </span>
                </div>

                <div>
                  <FiUser />
                  <span className={commonStyles.info}>{post.data.author}</span>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </main>

      {nextPage && (
        <footer className={styles.footer}>
          <button type="button" onClick={handleMorePosts}>
            Carregar mais posts
          </button>
        </footer>
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
    }
  );

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results,
      },
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
