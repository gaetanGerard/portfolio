import React, { useEffect, useRef } from 'react';
import Typed from "typed.js";
import ParticleBackground from '@/Components/ParticleBackground';
import { Link } from '@inertiajs/react'

const HeaderSection = ({data, userName}) => {
  const el = useRef(null);
  const section = data.headerSection;

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        `<p>${section.title}</p>`,
        `<p>${section.title} <span class="text-highlight">${userName}</span></p>`,
        `<p>${section.title} <span class="text-highlight">${userName}</span></p><p>${section.subtitle}</p>`,
      ],
      typeSpeed: 50,
      loop: true,
      loopCount: 1,
      showCursor: false
    });
    return () => {
      typed.destroy();
    };
  }, [section]);

  return (
    <div className="relative flex items-center justify-center h-screen">
            <div className="absolute top-50 left-50 text-white z-50 text-center">
              <div className="text-3xl" ref={el} />
              <Link href="TO DEFINE" className="uppercase border-2 p-3 mt-3 hover:border-highlight hover:text-highlight transition duration-500 ease-in-out" as="button" preserveScroll >{section.btnText}</Link>
            </div>
        <ParticleBackground />
    </div>
  )
}

export default HeaderSection