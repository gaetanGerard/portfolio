import React from 'react'

const Projects = ({data}) => {
    const section = data.projects;
  return (
    <div id="projects" className="bg-custom-dark p-5 w-full h-full">
        <div className="grid grid-flow-row gap-3 text-white justify-center justify-items-center">
            <h1>{section.title}</h1>
            <p className="w-50 text-center">{section.description}</p>
        </div>
    </div>
  )
}

export default Projects