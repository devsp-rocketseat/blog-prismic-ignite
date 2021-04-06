import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
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
  const router = useRouter();

  const wordsLength = post.data.content.reduce((acc, current) => {
    const arrayWords = RichText.asText(current.body).split(' ');
    return acc + arrayWords.length;
  }, 0);

  const readingTime = Math.ceil(wordsLength / 200);

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

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
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </span>
            </div>

            <div>
              <FiUser />
              <span className={commonStyles.info}>{post.data.author}</span>
            </div>

            <time>
              <FiClock />
              <span className={commonStyles.info}>{readingTime} min</span>
            </time>
          </div>
        </section>

        <article className={styles.containerContentPost}>
          {post.data.content.map(article => (
            <div key={article.heading}>
              <h2>{article.heading}</h2>

              <div
                className={styles.postContent}
                dangerouslySetInnerHTML={{
                  __html: RichText.asHtml(article.body),
                }}
              />
            </div>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query('');

  const paths = posts.results.splice(0, 2).map(post => ({
    params: {
      slug: post.uid,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      subtitle: response.data.subtitle,
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
