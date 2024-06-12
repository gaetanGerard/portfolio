import React from 'react'
import ParticleBackground from '@/Components/ParticleBackground';
import { TypeAnimation } from 'react-type-animation';

const HeaderSection = ({data}) => {
    const section = data.headerSection;
    console.log(section);
  return (
    <div className="relative flex items-center justify-center h-screen">
            <div className="absolute top-50 left-50 text-white z-50 text-center">
              <TypeAnimation
                  sequence={[
                      `${section.title}`, 1000,
                      `${section.title} ${section.name}`, 1000,
                      `${section.title} ${section.name}
                          ${section.subtitle}`,1000,

                  ]}
                  style={{ whiteSpace: 'pre-line', fontSize: '2em', display: 'block' }}
                  repeat={5}
                  wrapper="div"
              />
            </div>
        <ParticleBackground />
    </div>
  )
}

export default HeaderSection