import React, { useState, useEffect } from 'react';
import { Head, usePage, router  } from '@inertiajs/react';
import Nav from '@/Components/Nav';
import HeaderSection from './Sections/HeaderSection';
import About from './Sections/About';

export default function Portfolio() {
    const { localeData, user } = usePage().props;
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
            <>
                <Nav data={data} language={language} changeLocaleLanguage={changeLocaleLanguage} />
                <HeaderSection data={data} userName={user.name} />
                <About localeData={data} language={language} data={user} />
            </>
        </>
    );
}
