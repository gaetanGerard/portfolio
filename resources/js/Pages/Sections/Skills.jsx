import React from 'react'
import Tooltip from '@mui/material/Tooltip';
import Link from '@mui/material/Link';
import TechnoIcon from '@/Components/TechnoIcon';
import { motion } from 'framer-motion';
import { fadeIn, textVariant, staggerContainer } from '../../utils/motion';

const Skills = ({ categoryTechnologies, language, data }) => {
    const section = data.skills;

    return (
        <motion.section
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
        >
        <div id="skills" className="bg-custom-dark p-5 w-full h-full">
            <motion.div variants={textVariant()} className="text-white text-center mb-3">
                <h1>{section.title}</h1>
            </motion.div>
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.25 }}
                className="lg:grid flex flex-column lg:grid-cols-3 gap-3"
            >
                {categoryTechnologies.map((category, index) => (
                    category.lang === language ? (
                        <motion.div
                            variants={fadeIn('right', 'spring', index * 0.5, 0.75)}
                            key={index}
                            className={`category-container-${category.id} bg-custom-dark text-center p-3 shadow-lg rounded-lg`}
                        >
                            <h3 className="text-white text-center">{category.name}</h3>
                            <div
                                className={`flex flex-wrap justify-center place-self-stretch`}
                            >
                                {category.technologies.map((technology, index) => (
                                    <div key={index} className="m-2 p-2 bg-custom-light rounded-lg">
                                        <Link href={technology.technology_url} target="_blank" className="technology-logo" rel="noreferrer noopener">
                                            <TechnoIcon level={technology.skill_level} url={technology.icon_path} name={technology.name} data={section} />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : null
                ))}
            </motion.div>
        </div>
    </motion.section>

    )
}

export default Skills