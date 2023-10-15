"use client";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [record, setRecord] = useState();
  const [preloader, setPreloader] = useState(false);

  const getRecords = async (type) => {
    let res = await fetch(`http://localhost:8000/${type}`);
    const getRecords = await res.json();
    setRecord(getRecords);
    setPreloader(false);
  };

  console.log(record);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>CampusHub</h1>
      </div>
      <div className={styles.buttonSec}>
        <button
          onClick={() => {
            setRecord();
            setPreloader(true);
            getRecords("students");
          }}
        >
          Students
        </button>
        <button
          onClick={() => {
            setRecord();
            setPreloader(true);
            getRecords("teachers");
          }}
        >
          Teachers
        </button>
        <button
          onClick={() => {
            setRecord();
            setPreloader(true);
            getRecords("staff");
          }}
        >
          Staff
        </button>
      </div>
      <div className={styles.recordsContainer}>
        {preloader ? (
          <>
            <div className={styles.circlePreloader}>
              <div className={styles.circle}></div>
            </div>
          </>
        ) : (
          <></>
        )}
        {record ? (
          <>
            <h3>Name</h3>
            {record.map((item, index) => {
              return (
                <>
                  <p> {item.name} </p>
                </>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}
