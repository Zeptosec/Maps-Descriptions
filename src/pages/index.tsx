import Head from 'next/head'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { getAuth } from "firebase/auth";
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import Link from 'next/link';

const dbInstance = collection(db, 'maps');

interface Description {
  link: string,
  size: number,
  description: string,
  name: string,
  time: Array<Timestamp>
}

export default function Home({ arr }: any) {
  const auth = getAuth();
  const user = auth.currentUser;
  console.log(user);
  console.log(arr);
  return (
    <>
      <Head>
        <title>L4D2 maps descriptions</title>
        <meta name="description" content="Descriptions about some L4D2 maps mostly negative and funny" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href='https://css.gg/pen.css' rel='stylesheet'></link>
        <link href='https://css.gg/remove.css' rel='stylesheet'></link>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <table className='max-w-xl m-auto tb'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Description</th>
                <th>Date</th>
                {user ? <th>Options</th> : ""}
              </tr>
            </thead>
            <tbody>
              {arr.map((w: Description, k: number) => (
                <tr key={k} className="relative">
                  <td><a href={w.link}>{w.name}</a></td>
                  <td>{w.size}</td>
                  <td>{w.description}</td>
                  <td>{w.time.map(w => new Date(w.seconds * 1000).toISOString().split('T')[0]).join(", ")}</td>
                  {user ? <td>
                    <div className='flex gap-5 justify-center'>
                      <div className='w-6 cursor-pointer'>
                        <i className="gg-pen mt-2 ml-2"></i>
                      </div>
                      <div className='cursor-pointer'>
                        <i className="gg-remove"></i>
                      </div>
                    </div>
                  </td> : ""}
                </tr>
              ))}

            </tbody>
          </table>
          {user ? "" : <div className='text-center'>
            <h2>Want to edit?</h2>
            <Link href="/login">Login</Link>
          </div>}
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const rs = await getDocs(dbInstance);
  const arr = JSON.parse(JSON.stringify(rs.docs.map(w => {
    return { ...w.data() }
  })));
  return {
    props: { arr },
  };
}