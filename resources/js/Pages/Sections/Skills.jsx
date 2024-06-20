import React from 'react'
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import TechnoIcon from '@/Components/TechnoIcon';

const Skills = ({ categoryTechnologies, language, data }) => {
    const section = data.skills;
    return (
        <div className="bg-custom-dark p-5 w-full h-full">
            <h1 className="text-white text-center">{section.title}</h1>
            {categoryTechnologies.map((category, index) => (
                category.lang === language ? (
                    <div key={index} className="mb-5">
                        <h2 className="text-white text-center">{category.name}</h2>
                        <div className="flex flex-wrap justify-center">
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
            ))
            }
        </div>
    )
}

export default Skills