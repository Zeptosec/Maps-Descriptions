// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { db } from '@/firebase'
import { collection, getDocs, query } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  error?: string,
  played?: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === "GET") {
    const dbInstance = collection(db, 'maps');
    const rs = await getDocs(query(dbInstance));
    const arr = JSON.parse(JSON.stringify(rs.docs.map(w => {
      const data = w.data();
      const parts = data.link.split('/');
      return parts[parts.length - 1];
    })));
    return res.status(200).json({ played: arr });
  } else {
    return res.status(400).send({ error: "Method not allowed!" });
  }
}
