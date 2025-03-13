'use client';

import style from "./footer.module.css";
import { usePathname } from "next/navigation";
export default function Footer() {
  const pathName = usePathname();
  return (
    <>
    {pathName != '/' && (
        <div className={style.main}>© 2025 | Todos os direitos reservados</div>
    )}
    </>
  );
}
