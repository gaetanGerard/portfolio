import React, { useState, useEffect } from 'react';
import { Head, usePage, router  } from '@inertiajs/react';
import Nav from '@/Components/Nav';
import HeaderSection from './Sections/HeaderSection';
import About from './Sections/About';
import Skills from './Sections/Skills';
import Projects from './Sections/Projects';

export default function Portfolio() {
    const { localeData, user, categories, technologies, categoryTechnologies } = usePage().props;
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
                <About description={language === "fr" ? user.fr_description : user.en_description} picture={user.user_img} />
                <Skills categoryTechnologies={categoryTechnologies} language={language} data={data} />
                <Projects data={data} />
            </>
        </>
    );
}
