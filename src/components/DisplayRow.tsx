import { Description } from "@/pages";
import { User } from "firebase/auth";

interface RowData {
    desc: Description,
    startEdit: Function,
    remove: Function,
    user: User | null,
}

export default function DisplayRow({ desc, startEdit, remove, user }: RowData) {

    return (
        <>
            <td className=" align-top"><a className="text-blue-600" href={desc.link}>{desc.name}</a></td>
            <td className=" align-top"><div dangerouslySetInnerHTML={{ __html: desc.size }} /></td>
            <td className=" align-top"><div dangerouslySetInnerHTML={{ __html: desc.description }} /></td>
            <td className="w-32 align-top">{desc.time.map(w => new Date(w.seconds * 1000).toISOString().split('T')[0]).join(", ")}</td>
            {user ? <td>
                <div className='flex gap-5 justify-center'>
                    <div className='w-6 cursor-pointer' onClick={() => startEdit(desc)}>
                        <i className="gg-pen mt-2 ml-2"></i>
                    </div>
                    <div className='cursor-pointer' onClick={() => { remove(desc) }}>
                        <i className="gg-remove"></i>
                    </div>
                </div>
            </td> : ""}
        </>
    );
}