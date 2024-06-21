import React from 'react'
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import TechnoIcon from '@/Components/TechnoIcon';

const Skills = ({ categoryTechnologies, language, data }) => {
    const section = data.skills;

    return (
        <div id="skills" className="bg-custom-dark p-5 w-full h-full">
            <h1 className="text-white text-center">{section.title}</h1>
            <div className="lg:grid flex flex-column lg:grid-cols-3 gap-3">
                {categoryTechnologies.map((category, index) => (
                    category.lang === language ? (
                        <div key={index} className={`category-container-${category.id} bg-custom-dark text-center p-3 shadow-lg rounded-lg`}>
                            <h3 className="text-white text-center">{category.name}</h3>
                            <div className={`flex flex-wrap justify-center place-self-stretch`}>
                                {category.technologies.map((technology, index) => (
                                    <div key={index} className="m-2 p-2 bg-custom-light rounded-lg">
                                        <Link href={technology.technology_url} target="_blank" className="technology-logo" rel="noreferrer noopener">
                                            <TechnoIcon level={technology.skill_level} url={technology.icon_path} name={technology.name} data={section} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : null
                ))}
            </div>
        </div>
    )
}

export default Skills