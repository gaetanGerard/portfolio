import React, { useState, useEffect } from 'react';
import { Head, usePage, router  } from '@inertiajs/react';
import Nav from '@/Components/Nav';
import HeaderSection from './Sections/HeaderSection';

export default function Portfolio() {
    const { localeData } = usePage().props;
    const [language, setLanguage] = useState('fr');

    const { data } = localeData;

    /*
    *
    *
    *
    *
    * Ajouter editeur WYSIWYG au différent formulaire dans l'admin utilisant
    * un textarea (composant React https://jpuri.github.io/react-draft-wysiwyg/#/)
    *
    */


    const changeLocaleLanguage = (e) => {
        setLanguage(e.target.checked ? "fr" : "gb");
        router.post('/change-language', {
            language: e.target.checked ? "fr" : "gb"
        })
    }

    useEffect(() => {
        router.post('/change-language', {
            language: language
        })
    }, [language])

    return (
        <>
            <Head title="Portfolio" />
            <>
                <Nav data={data} language={language} changeLocaleLanguage={changeLocaleLanguage} />
                <HeaderSection data={data} />
            </>
        </>
    );
}
