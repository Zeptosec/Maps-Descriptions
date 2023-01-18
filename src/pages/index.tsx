import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { getAuth } from "firebase/auth";
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';

const inter = Inter({ subsets: ['latin'] })
const dbInstance = collection(db, 'maps');

interface Description {
  link: string,
  size: number,
  description: string,
  name: string,
  time: Array<Timestamp>
}

export default function Home() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [mapData, setMapData] = useState<Array<Description>>([]);
  useEffect(() => {
    async function fetchData() {
      const rs = await getDocs(dbInstance);
      const arr = rs.docs.map(w => {
        return { ...w.data() }
      }) as Array<Description>;
      setMapData(arr);
      console.log(arr);
    }
    fetchData();
  }, [])

  return (
    <>
      <Head>
        <title>L4D2 maps descriptions</title>
        <meta name="description" content="Descriptions about some L4D2 maps mostly negative and funny" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <table className='max-w-xl'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {mapData.map((w, k) => (
                <tr key={k}>
                  <td><a href={w.link}>{w.name}</a></td>
                  <td>{w.size}</td>
                  <td>{w.description}</td>
                  <td>{w.time.map(w => new Date(w.seconds *1000).toISOString().split('T')[0]).join(", ")}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
