import { browserLocalPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";

export default function Login() {

    const [user, setUser] = useState({ username: '', password: '' })
    const router = useRouter()

    const signIn = () => {

        const auth = getAuth();
        setPersistence(auth, browserLocalPersistence)
        signInWithEmailAndPassword(auth, user.username, user.password)
            .then((userCredential) => {
                // Signed in 
                router.push('/')
            })
            .catch((error) => {
                //  const errorCode = error.code;
                const errorMessage = error.message;
                //   console.log('login NOK ', errorCode,errorMessage)
                alert(errorMessage.split(':')[1])

            });
    }

    return (<div>
        <Head>
            <title>Maps descriptions - Log in</title>
            <meta
                name="description"
                content="company"
            />
            <link
                href="/assets/blog/favicon.ico"
                rel="shortcut icon"
                type="image/x-icon"
            />
        </Head>
        <div className="items-center justify-center flex h-screen"><div className="w-full max-w-xs">
            <form className="bg-gradient-to-r from-green-400 to-blue-500 shadow-md rounded px-8 pt-6 pb-4 mb-2">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username"
                        onChange={event => setUser({ ...user, username: event.target.value })} />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"
                        onChange={event => setUser({ ...user, password: event.target.value })} />

                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button" onClick={signIn}>
                        Sign In
                    </button>

                </div>

            </form>
            <p className="text-center text-gray-500 text-xs">
                &copy; {new Date().getFullYear()} Maps descriptions. All rights reserved.
            </p>
        </div></div></div>)
}