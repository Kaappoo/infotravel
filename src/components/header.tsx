"use client";
import Link from "next/link";
import styles from "./header.module.css";
import { usePathname } from "next/navigation";
import {
  ArrowRightEndOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const pathname = usePathname();
  return (
    <header
      className={`${styles.header} ${pathname !== "/" ? styles.white : ""}`}
    >
      <Link href="/" className={styles.logo}>
        infotravel
      </Link>
      <div className={styles.actions}>
        {pathname !== "/" && (
        <Link href="/" className={styles.action}>
          <HomeIcon className={styles.icon} />
          Página Inicial
        </Link>
        )}

        <Link href="/" className={styles.action}>
          <ArrowRightEndOnRectangleIcon className={styles.icon} />
          Iniciar Sessão
        </Link>
      </div>
    </header>
  );
}
