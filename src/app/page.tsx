"use client";

import Image from "next/image";
import styles from "./page.module.css";
import SearchComponent from "@/components/searchComponent";
import { Slider } from "@heroui/slider";
import React from "react";

export default function Home() {
  const [value, setValue] = React.useState([100, 300]);
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Os melhores <span className={styles.highlight}> Hoteis </span>  e <span className={styles.highlight}> Destinos </span> <br></br> para sua viagem</h1>
      <SearchComponent />
    </div>
  );
}
