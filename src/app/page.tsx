import Image from "next/image";
import styles from "./page.module.css";
import MultiSelectDropdown from "../components/multiselectdropdown"

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
      <MultiSelectDropdown></MultiSelectDropdown>
    </main>
  );
}
