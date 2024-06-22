import React, { useState, useEffect } from 'react';
import { Head, usePage, router  } from '@inertiajs/react';
import Nav from '@/Components/Nav';
import HeaderSection from './Sections/HeaderSection';
import About from './Sections/About';
import Skills from './Sections/Skills';
import Projects from './Sections/Projects';
import Experiences from './Sections/Experiences';
import FloatingBtn from '@/Components/FloatingBtn';

export default function Portfolio() {
    const { localeData, user, categoryTechnologies, projects, experiences } = usePage().props;
    const [language, setLanguage] = useState('fr');
    const [localProjects, setLocalProjects] = useState([]);
    const [localExperiences, setLocalExperiences] = useState([]);

    const { data } = localeData;

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
        setLocalProjects(filteredProjects);
        setLocalExperiences(filteredExperiences);
    }, [language, projects, experiences])


    return (
        <>
            <Head title="Portfolio" />
            <>
                <Nav data={data} language={language} changeLocaleLanguage={changeLocaleLanguage} />
                <HeaderSection data={data} userName={user.name} />
                <About description={language === "fr" ? user.fr_description : user.en_description} picture={user.user_img} language={language} />
                <Skills data={data} categoryTechnologies={categoryTechnologies} language={language} />
                <Projects data={data} projects={localProjects} language={language} />
                <Experiences data={data} experiences={localExperiences} language={language} />
                <FloatingBtn data={data.social} />
            </>
        </>
    );
}
