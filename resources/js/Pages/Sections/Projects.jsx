import React, { useState, useEffect } from 'react'
import Accordion from '@/Components/Accordion';

const Projects = ({data, projects}) => {
    const section = data.projects;
    const [expanded, setExpanded] = useState(0);

  return (
    <div id="projects" className="bg-custom-dark p-5 w-full h-full">
        <div className="grid grid-flow-row gap-3 text-white justify-center justify-items-center">
            <h1>{section.title}</h1>
            <p className="sm:w-100 lg:w-2/4 text-center">{section.description}</p>
            <div className="2xl:max-w-[1400px] w-full mx-auto flex flex-col">
                <div className="mt-[50px] flex lg:flex-row flex-col min-h-[70vh] gap-3 justify-center">
                    {projects.map((project) => (
                        <Accordion key={project.id} i={project.id} project={project} expanded={expanded} setExpanded={setExpanded} data={section} />
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default Projects