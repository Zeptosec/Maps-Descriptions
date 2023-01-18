import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
const dbInstance = collection(db, 'maps');

export default function theProps({ message, arr }: any) {
    console.log(arr);
    return (
        <div>
            <h1>{message}</h1>
        </div>
    )
}

export async function getServerSideProps() {
    const rs = await getDocs(dbInstance);
    const arr = JSON.parse(JSON.stringify(rs.docs.map(w => {
        return { ...w.data() }
    })));
    return {
        props: { message: "Welcome to the About Page", arr },
    };
}