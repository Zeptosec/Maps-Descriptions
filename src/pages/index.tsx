import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { db } from '../firebase';
import { useEffect, useRef, useState } from 'react';
import { collection, query, getDocs, Timestamp, doc, updateDoc, deleteDoc, onSnapshot, orderBy, where, OrderByDirection } from 'firebase/firestore';
import Link from 'next/link';
import DisplayRow from '@/components/DisplayRow';
import EditRow from '@/components/EditRow';
import AddNew from '@/components/AddNew';

const dbInstance = collection(db, 'maps');

export interface Description {
  link: string,
  size: string,
  description: string,
  name: string,
  time: Array<Timestamp>
  id: string,
  modified: number
}

export default function Home({ arr }: any) {
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [currDesc, setCurrentDesc] = useState<Description | null>(null);
  const [maps, setMaps] = useState<Array<Description>>(arr);
  const [disp, setDisp] = useState<Array<Description>>(arr);
  const [prevVal, setPrevVal] = useState<string>("");
  const [ord, setOrd] = useState<Ordering>({ col: 'time', dir: "desc" });
  useEffect(() => {
    onAuthStateChanged(auth, usr => {
      setUser(usr);
    });
    const qr = query(dbInstance, where("modified", '>=', new Date().valueOf()));
    const unsub = onSnapshot(qr, snapshot => {
      snapshot.docChanges().forEach(change => {
        const elem = { ...change.doc.data(), id: change.doc.id } as Description;
        console.log(change.type);
        console.log(elem);
        if (change.type === "added" || change.type === "modified") {
          const ind = maps.findIndex(w => w.id === elem.id);
          if (ind === -1) {
            setMaps(w => [...w, elem]);
          } else {
            setMaps(w => [...w.slice(0, ind), elem, ...w.slice(ind + 1)]);
          }
        }
        // removed does not work for whatever reason
        // probably because im fetching data from getServerSideProps
        // i should be doing here but that would require to make 
        // a loading screen soooooo i wont do that.
        // if (change.type === 'removed') {
        //   const ind = maps.findIndex(w => w.id === elem.id);
        //   console.log(maps);
        //   console.log(ind);
        //   if (ind !== -1) {
        //     setMaps(w => [...w.slice(0, ind), ...w.slice(ind + 1)]);
        //   } else {
        //     console.error("Element not found in maps");
        //     console.error(elem);
        //   }
        // }
      })

    })
    return () => {
      unsub();
    }
  }, [])

  function startEdit(w: Description) {
    if (w.id === currDesc?.id) return;
    setCurrentDesc(w);
  }

  async function remove(w: Description) {
    const acception = confirm(`You're about to delete map "${w.name}"`);
    if (!acception) return;
    const acception2 = confirm(`You won't be able to recover after this`);
    if (!acception2) return;
    const acception3 = confirm(`Last warning`);
    if (!acception3) return;

    const docRef = doc(db, "maps", w.id);
    try {
      await deleteDoc(docRef);
      const ind = maps.indexOf(w);
      if (ind !== -1)
        setMaps(w => [...w.slice(0, ind), ...w.slice(ind + 1)]);
      else {
        console.log("element was not found");
      }
      console.log("removed element " + ind);
    } catch (err) {
      console.log(err);
    }
  }

  async function update(w: Description) {
    const docRef = doc(db, "maps", w.id);
    try {
      w.modified = new Date().valueOf();
      const { id, ...rest } = w;
      await updateDoc(docRef, { ...rest });
      const currIndex = maps.findIndex(a => a.id === currDesc?.id);
      setMaps(a => [...a.slice(0, currIndex), w, ...a.slice(currIndex + 1)]);
      setCurrentDesc(null);
    } catch (err) {
      console.log(err);
    }
  }

  function cancel() {
    setCurrentDesc(null);
  }

  interface Ordering {
    dir: OrderByDirection,
    col: string
  }

  function comparator(a: any, b: any) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  function sortDescriptions(toSort: Array<Description>) {
    let tmp = [...toSort];
    switch (ord.col) {
      case "name":
        if (ord.dir === "asc") {
          tmp.sort((a, b) => comparator(a.name, b.name))
        } else {
          tmp.sort((a, b) => comparator(b.name, a.name))
        }
        break;
      case "time":
        if (ord.dir === "asc") {
          tmp.sort((a, b) => comparator(a.time[0].seconds, b.time[0].seconds))
        } else {
          tmp.sort((a, b) => comparator(b.time[0].seconds, a.time[0].seconds))
        }
        break;
      case "size":
        if (ord.dir === "asc") {
          tmp.sort((a, b) => comparator(parseInt(a.size), parseInt(b.size)))
        } else {
          tmp.sort((a, b) => comparator(parseInt(b.size), parseInt(a.size)))
        }
        break;
      case "description":
        if (ord.dir === "asc") {
          tmp.sort((a, b) => comparator(a.description, b.description))
        } else {
          tmp.sort((a, b) => comparator(b.description, a.description))
        }
        break;
      default:
        tmp.sort((a, b) => comparator(b.time, a.time))
        break;
    }
    return tmp;
  }


  async function searchFor(val: string, pass: boolean = false) {
    if (prevVal === val && !pass) return;
    let tmp;
    if (val.length === 0) {
      tmp = sortDescriptions(maps);
    } else {
      let rez = maps.filter(w => w.description.includes(val) || w.link.includes(val) || w.name.includes(val));
      tmp = sortDescriptions(rez);
    }
    setDisp(tmp);
    setPrevVal(val);
  }

  let tmout: NodeJS.Timeout;
  function searchChanged(val: string) {
    clearTimeout(tmout);
    tmout = setTimeout(() => searchFor(val), 1000);
  }

  function changeSort(col: string) {
    setOrd(w => {
      if (w.col === col) {
        if (w.dir === "asc") {
          return { col: w.col, dir: "desc" };
        } else {
          return { col: w.col, dir: "asc" };
        }
      } else {
        return { col, dir: "desc" };
      }
    })
  }
  const isFirstRun = useRef(true);
  const isFirstRun2 = useRef(true);

  useEffect(() => {
    if (isFirstRun2.current) {
      isFirstRun2.current = false;
      return;
    }
    console.log("maps changed " + maps.length);
    searchFor(prevVal, true);
  }, [maps])

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setDisp(w => sortDescriptions(w));
  }, [ord]);

  return (
    <>
      <Head>
        <title>L4D2 maps descriptions</title>
        <meta name="description" content="Descriptions about some L4D2 maps mostly negative and funny" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className='max-w-4xl m-auto'>
          <div className='my-2 flex justify-between'>
            <div className='flex items-end'>
              <p>{maps.length} items</p>
            </div>
            <div>
              <p className='text-center'>Search</p>
              <input onChange={w => searchChanged(w.target.value)} type="text" className='input-grad shadow appearance-none rounded border-2 w-64 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
            </div>
          </div>
          <table className='tb mb-4'>
            <thead>
              <tr>
                <th onClick={() => changeSort('name')} className='cursor-pointer select-none'>
                  <div className='flex'>
                    <p>Name</p>
                    {ord.col === "name" ? ord.dir === "asc" ? <i className="gg-arrow-down"></i> : <i className="gg-arrow-up"></i> : ""}
                  </div>
                </th>
                <th onClick={() => changeSort('size')} className='cursor-pointer select-none'>
                  <div className='flex'>
                    <p>Size</p>
                    {ord.col === "size" ? ord.dir === "asc" ? <i className="gg-arrow-down"></i> : <i className="gg-arrow-up"></i> : ""}
                  </div>
                </th>
                <th onClick={() => changeSort('description')} className='cursor-pointer select-none'>
                  <div className='flex'>
                    <p>Description</p>
                    {ord.col === "description" ? ord.dir === "asc" ? <i className="gg-arrow-down"></i> : <i className="gg-arrow-up"></i> : ""}
                  </div>
                </th>
                <th onClick={() => changeSort('time')} className='cursor-pointer select-none' >
                  <div className='flex'>
                    <p>Date</p>
                    {ord.col === "time" ? ord.dir === "asc" ? <i className="gg-arrow-down"></i> : <i className="gg-arrow-up"></i> : ""}
                  </div>
                </th>
                {user ? <th>Options</th> : ""}
              </tr>
            </thead>
            <tbody>
              {disp.map((w: Description, k: number) => (
                <tr key={k}>
                  {currDesc?.id === w.id ?
                    <EditRow desc={w} update={update} cancel={cancel} /> :
                    <DisplayRow desc={w} startEdit={startEdit} remove={remove} user={user} />}
                </tr>
              ))}

            </tbody>
          </table>
          {user ? <AddNew /> : <div className='text-center'>
            <h2>Want to edit?</h2>
            <Link className='text-blue-600' href="/login">Login</Link>
          </div>}
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const rs = await getDocs(query(dbInstance, orderBy('time', 'desc')));
  const arr = JSON.parse(JSON.stringify(rs.docs.map(w => {
    return { ...w.data(), id: w.id }
  })));
  return {
    props: { arr },
  };
}