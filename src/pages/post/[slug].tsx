import { GetStaticPaths, GetStaticProps } from 'next';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
/* eslint-disable react/no-danger */

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const wordsLength = post.data.content.reduce((acc, current) => {
    const arrayWords = RichText.asText(current.body).split(' ');
    return acc + arrayWords.length;
  }, 0);

  const readingTime = Math.ceil(wordsLength / 200);

  return (
    <>
      <Header className={styles.headerMargin} />

      <img
        src={post.data.banner.url}
        className={styles.bannerImg}
        alt="banner"
      />

      <main className={styles.container}>
        <section className={styles.containerInfoPost}>
          <h1>{post.data.title}</h1>

          <div className={commonStyles.containerInfo}>
            <div>
              <FiCalendar />
              <span className={commonStyles.info}>
                {post.first_publication_date}
              </span>
            </div>

            <div>
              <FiUser />
              <span className={commonStyles.info}>{post.data.author}</span>
            </div>

            <div>
              <FiClock />
              <span className={commonStyles.info}>{readingTime} min</span>
            </div>
          </div>
        </section>

        <section className={styles.containerContentPost}>
          {post.data.content.map(article => (
            <article key={RichText.asText(article.heading)}>
              <h2>{RichText.asText(article.heading)}</h2>

              <div
                className={styles.postContent}
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(article.body),
                }}
              />
            </article>
          ))}
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd MMM yyyy',
      { locale: ptBR }
    ),
    data: {
      title: RichText.asText(response.data.title),
      banner: {
        url: response.data.banner.url,
      },
      author: RichText.asText(response.data.author),
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
  };
};
