import React, { useState } from 'react';
import { Link, Head, usePage, router  } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import SelectLanguage from '@/Components/SelectLanguage';
import axios from 'axios';

export default function Portfolio({ auth, laravelVersion, phpVersion }) {
    const { localeData } = usePage().props;
    const [language, setLanguage] = useState('fr');

    const { data } = localeData;


    const changeLocaleLanguage = (e) => {
        setLanguage(e.target.checked ? "fr" : "gb");
        router.post('/change-language', {
            language: e.target.checked ? "fr" : "gb"
        })
    }

    return (
        <>
            <Head title="Portfolio" />
            <div>
                <div className="relative flex flex-col justify-center">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-1">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20]"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>
                    </div>
                </div>
                <div>
                    <SelectLanguage localeLanguage={language}  changeLocaleLanguage={changeLocaleLanguage} />
                    <p>{data.title}</p>
                </div>
            </div>
        </>
    );
}
