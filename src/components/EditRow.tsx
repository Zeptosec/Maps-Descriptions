import { Description } from "@/pages";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";

interface RowData {
    desc: Description,
    update: Function,
    cancel: Function
}

export default function EditRow({ desc, update, cancel }: RowData) {
    const [name, setName] = useState<string>(desc.name);
    const [link, setLink] = useState<string>(desc.link);
    const [size, setSize] = useState<string>(desc.size);
    const [description, setDescription] = useState<string>(desc.description);
    const [dates, setDates] = useState<Array<Timestamp>>(desc.time);

    function addDate() {
        setDates(w => [...w, Timestamp.fromDate(new Date())]);
    }

    function removeDate(k: number) {
        setDates(w => [...w.slice(0, k), ...w.slice(k + 1)]);
    }

    return (
        <>
            <td>
                <div className="grid grid-cols-1 gap-2 min-w-[170px]">
                    <label htmlFor="Name">Name</label>
                    <input type="text" name="Name" id="Name" value={name} onChange={w => setName(w.target.value)} />
                    <label htmlFor="Link">Link</label>
                    <input type="text" name="Link" id="Link" value={link} onChange={w => setLink(w.target.value)} />
                </div>
            </td>
            <td><input className="w-16" type="text" name="Size" id="Size" value={size} onChange={w => setSize(w.target.value)} /></td>
            <td><textarea className="resize" name="Descrip" id="Descrip" value={description} onChange={w => setDescription(w.target.value)} /></td>
            <td>{dates.map((w, k) => (
                <div key={`${k}b`} className="flex gap-2">
                    <input type="date" key={`${k}a`} value={new Date(w.seconds * 1000).toISOString().split('T')[0]} onChange={e => setDates(dts => [...dts.slice(0, k), Timestamp.fromDate(new Date(e.target.value)), ...dts.slice(k + 1)])} />
                    <div className="w-6 mt-0.5 cursor-pointer" onClick={() => removeDate(k)}>
                        <i className="gg-remove" ></i>
                    </div>
                </div>
            ))}
                <div className="mt-2 w-6 m-auto cursor-pointer" onClick={addDate}>
                    <i className="gg-add"></i>
                </div>
            </td>
            {/* {desc.time.map(w => new Date(w.seconds * 1000).toISOString().split('T')[0]).join(", ")} */}
            <td>
                <div className='flex gap-4 justify-center'>
                    <div className='w-6 cursor-pointer' onClick={() => update({ description, name, link, size, time: dates, id: desc.id } as Description)}>
                        <i className="gg-check-o"></i>
                    </div>
                    <div className='cursor-pointer' onClick={() => cancel()} >
                        <i className="gg-remove" ></i>
                    </div>
                </div>
            </td>
        </>
    );
}