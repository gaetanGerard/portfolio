import React, { useState, useEffect } from 'react'
import Accordion from '@/Components/Accordion';
import { motion } from 'framer-motion';
import { staggerContainer } from '../../utils/motion';

const Projects = ({data, projects, language}) => {
    const section = data.projects;
    const [active, setActive] = useState(language === "fr" ? 3 : 4);

    const innerWidth = '2xl:max-w-[1280px] w-full';

  return (
    <div id="projects" className="bg-custom-dark p-5 w-full h-full">
        <div className="grid grid-flow-row gap-3 text-white justify-center justify-items-center">
            <h1>{section.title}</h1>
            <p className="sm:w-100 lg:w-2/4 text-center">{section.description}</p>
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.25 }}
                className={`${innerWidth} mx-auto flex flex-col`}>
                <div className="mt-[50px] flex lg:flex-row flex-col min-h-[70vh] gap-3 justify-center">
                    {projects.map((project, index) => (
                        <Accordion
                            key={project.id}
                            index={index}
                            project={project}
                            active={active}
                            handleClick={setActive}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    </div>
  )
}

export default Projects