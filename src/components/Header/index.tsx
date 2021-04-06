import Link from 'next/link';
import styles from './header.module.scss';

interface HeaderProps {
  className: string;
}

export default function Header({ className }: HeaderProps): JSX.Element {
  return (
    <Link href="/">
      <a>
        <header
          className={
            !className ? styles.header : `${styles.header} ${className}`
          }
        >
          <img src="/logo.svg" alt="logo" />
        </header>
      </a>
    </Link>
  );
}
