import { db } from "@/firebase";
import { Description } from "@/pages";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";

export default function AddNew() {
    const [name, setName] = useState<string>("");
    const [link, setLink] = useState<string>("");
    const [size, setSize] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [dates, setDates] = useState<Array<Timestamp>>([Timestamp.fromDate(new Date())]);
    const [adding, setAdding] = useState<boolean>(false);
    function addDate() {
        setDates(w => [...w, Timestamp.fromDate(new Date())]);
    }

    function removeDate(k: number) {
        setDates(w => [...w.slice(0, k), ...w.slice(k + 1)]);
    }

    async function add() {
        if (adding) return;
        setAdding(true);
        const data = {
            description,
            name,
            link,
            time: dates,
            size,
            modified: new Date().valueOf()
        };
        try {
            const dbRef = collection(db, "maps");
            const rs = await addDoc(dbRef, data);
            setName("");
            setLink("");
            setSize("");
            setDescription("");
            setDates([Timestamp.fromDate(new Date())]);
        } catch (err) {
            console.log(err);
        } finally {
            setTimeout(() => setAdding(false), 1000);
        }
    }
    return (
        <div className="max-w-[700px] m-auto bg-gradient-to-r from-green-400 to-blue-500 shadow-md rounded px-8 pt-6 pb-4 mb-2">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="" id="" value={name} onChange={w => setName(w.target.value)} />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Link</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="" id="" value={link} onChange={w => setLink(w.target.value)} />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Size</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={size} onChange={w => setSize(w.target.value)} />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={description} onChange={w => setDescription(w.target.value)} />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Dates</label>
                <div>
                    {dates.map((w, k) => (
                        <div key={`${k}b`} className="flex gap-2 mt-2">
                            <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="date" key={`${k}a`} value={new Date(w.seconds * 1000).toISOString().split('T')[0]} onChange={e => setDates(dts => [...dts.slice(0, k), Timestamp.fromDate(new Date(e.target.value)), ...dts.slice(k + 1)])} />
                            <div className="flex items-center cursor-pointer" onClick={() => removeDate(k)}>
                                <i className="gg-remove" ></i>
                            </div>
                        </div>
                    ))}
                    <div className="mt-2 w-6 cursor-pointer" onClick={addDate}>
                        <i className="gg-add"></i>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <button disabled={adding} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-600 disabled:opacity-60" type="button" onClick={add}>
                    Add
                </button>

            </div>
        </div>
    )
}