import React, { useState, useEffect } from 'react';
import { Head, usePage, router  } from '@inertiajs/react';
import Nav from '@/Components/Nav';
import HeaderSection from './Sections/HeaderSection';
import About from './Sections/About';
import Skills from './Sections/Skills';
import Projects from './Sections/Projects';
import Experiences from './Sections/Experiences';
import Footer from './Sections/Footer';
import FloatingBtn from '@/Components/FloatingBtn';

export default function Portfolio() {
    const { localeData, user, categoryTechnologies, projects, experiences, cvs } = usePage().props;
    const { data, languageCode } = localeData;
    const [language, setLanguage] = useState(languageCode);
    const [localProjects, setLocalProjects] = useState([]);
    const [localExperiences, setLocalExperiences] = useState([]);
    const [localCV, setLocalCV] = useState(null);


    const changeLocaleLanguage = (e) => {
        setLanguage(e.target.checked ? "fr" : "gb");
        router.post('/change-language', {
            language: e.target.checked ? "fr" : "gb"
        }, {
            preserveScroll: true
        });
    }

    useEffect(() => {
        const filteredProjects = projects.filter(project => project.lang === language);
        const filteredExperiences = experiences.filter(experience => experience.lang === language);
        const filteredCV = cvs.filter(cv => cv.lang === language);
        setLocalProjects(filteredProjects);
        setLocalExperiences(filteredExperiences);
        setLocalCV(filteredCV[0])
    }, [language, projects, experiences, languageCode, cvs])


    return (
        <>
            <Head title="Portfolio" />
            <>
                <Nav data={data} language={language} changeLocaleLanguage={changeLocaleLanguage} />
                <HeaderSection data={data} userName={user.name} cv={localCV} language={language} />
                <About description={language === "fr" ? user.fr_description : user.en_description} picture={user.user_img} language={language} />
                <Skills data={data} categoryTechnologies={categoryTechnologies} language={`${languageCode}`} />
                <Projects data={data} projects={localProjects} language={language} />
                <Experiences data={data} experiences={localExperiences} language={language} />
                <Footer data={data} />
                <FloatingBtn data={data.social} />
            </>
        </>
    );
}
