import React from 'react'
import { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const [form, setform] = useState({ site: "", username: "", password: "" })
    const [passwordArray, setpasswordArray] = useState([])

    const getPasswords = async () => {
        let req = await fetch("http://localhost:3000/")
        let passwords = await req.json()
        setpasswordArray(passwords)
    }

    useEffect(() => {
        getPasswords();
    }, [])

    const ref = useRef()
    const passwordRef = useRef()

    const showPassword = () => {
        passwordRef.current.type = "text"
        if (ref.current.src.includes("/assets/hidden.png")) {
            ref.current.src = "/assets/show.png"
            passwordRef.current.type = "password"
        }
        else {
            ref.current.src = "/assets/hidden.png"
            passwordRef.current.type = "text"
        }
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const copyText = (text) => {
        navigator.clipboard.writeText(text)
        toast('🦄 Copied', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }

    const savePassword = async () => {
        if (form.site.length >= 1 && form.username.length >= 1 && form.password.length >= 1) {
            if (form.id) {
                await fetch("http://localhost:3000/", {
                    method: "DELETE",
                    headers: { "content-Type": "application/json" },
                    body: JSON.stringify({ id: form.id })
                });
            }

            const newEntry = { ...form, id: form.id || uuidv4() };

            await fetch("http://localhost:3000/", {
                method: "POST",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify(newEntry)
            });

            setpasswordArray([...passwordArray, newEntry]);
            setform({ site: "", username: "", password: "" });
        }
        else {
            toast('🦄 Empty Input');
        }
    }

    const deletePassword = async (id) => {
        let C = confirm("Delete Permanently")
        if (C) {
            setpasswordArray(passwordArray.filter(item => item.id != id))
            let res = await fetch("http://localhost:3000/", {
                method: "DELETE",
                headers: { "content-Type": "application/json" },
                body: JSON.stringify({ id })
            })
        }
        toast('🦄 Deleted', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }

    const editPassword = (id) => {
        setform({ ...passwordArray.filter(i => i.id === id)[0], id: id })
        setpasswordArray(passwordArray.filter(item => item.id !== id))

        toast('🦄 Hit Add after Editing', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-0">
                <div className="logo font-bold mx-4 text-white flex justify-center m-2">
                    <span className='text-green-500'>&lt;</span>Password<span className='text-amber-300'>Manager</span><span className='text-green-500'>/&gt;</span>
                </div>
                <div className='text-white flex justify-center'>
                    Your Own Password Keeper
                </div>

                <div className="text-white flex flex-col p-4 items-center gap-1.5">

                    <input
                        value={form.site}
                        onChange={handleChange}
                        placeholder="Enter Website"
                        type="text"
                        name='site'
                        id="site"
                        className="text-black rounded-lg bg-white p-1.5 border-2 border-blue-800 w-full max-w-4xl"
                    />

                    <input
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Enter Username"
                        type="text"
                        name='username'
                        id="username"
                        className="text-black rounded-lg bg-white p-1.5 border-2 border-blue-800 w-full max-w-4xl"
                    />

                    <div className="relative w-full max-w-4xl">
                        <input
                            ref={passwordRef}
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Enter Password"
                            type="password"
                            name='password'
                            id="password"
                            className="text-black rounded-lg bg-white p-1.5 border-2 border-blue-800 w-full max-w-4xl"
                        />

                        <div className="absolute right-0 top-1/2 -translate-y-1/2 mr-5 cursor-pointer" onClick={showPassword}>
                            <img ref={ref} width={20} src="/assets/show.png" alt="show" />
                        </div>
                    </div>
                    <button onClick={savePassword} className="
                    text-white font-semibold
                    px-6 py-2.5
                    mt-2.5
                    rounded-lg
                    bg-linear-to-r from-amber-500 to-orange-500
                    shadow-lg shadow-orange-500/20
                    hover:scale-105
                    hover:shadow-orange-500/40
                    active:scale-95
                    transition-all duration-200
                    cursor-pointer">
                        Add</button>

                </div>
            </div>
            <div className="passwords flex flex-col items-center">
                <h1 className='text-white font-bold pb-3.5'>Your Credentials</h1>
                {passwordArray.length === 0 && <div className='text-white'>No Credentials Saved</div>}
                {passwordArray.length != 0 && (
                    <div className="w-full max-w-4xl h-[40vh] md:h-[calc(100vh-420px)] overflow-y-auto overflow-x-auto px-4">
                        <table className="table-auto text-white w-full">
                            <thead className=' bg-green-500 '>
                                <tr>
                                    <th>Site</th>
                                    <th>Username</th>
                                    <th>Password</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='bg-green-300'>
                                {passwordArray.map((item, index) => {
                                    return <tr key={index} className='border'>
                                        <td className="border py-1 px-2 text-gray-700">
                                            <div className="flex items-center justify-between">
                                                <a href={item.site}>{item.site}</a>

                                                <img onClick={() => { copyText(item.site) }}
                                                    className="w-4 h-4 cursor-pointer"
                                                    src="assets/copy.png"
                                                    alt="copy"
                                                />
                                            </div>
                                        </td>
                                        <td className="border py-1 px-2 text-gray-700">
                                            <div className="flex items-center justify-between">
                                                <span>{item.username}</span>

                                                <img onClick={() => { copyText(item.username) }}
                                                    className="w-4 h-4 cursor-pointer"
                                                    src="assets/copy.png"
                                                    alt="copy"
                                                />
                                            </div>
                                        </td>
                                        <td className="border py-1 px-2 text-gray-700">
                                            <div className="flex items-center justify-between">
                                                <span>{"*".repeat(item.password.length)}</span>

                                                <img onClick={() => { copyText(item.password) }}
                                                    className="w-4 h-4 cursor-pointer"
                                                    src="assets/copy.png"
                                                    alt="copy"
                                                />
                                            </div>
                                        </td>
                                        <td className="border py-1 px-2 text-gray-700">
                                            <div className="flex items-center justify-center gap-5.5">
                                                <img onClick={() => { editPassword(item.id) }} className='w-4 cursor-pointer' src="assets/edit.png" alt="edit" />
                                                <img onClick={() => { deletePassword(item.id) }} className='w-4 cursor-pointer' src="assets/bin.png" alt="delete" />
                                            </div>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    )
}

export default Manager
