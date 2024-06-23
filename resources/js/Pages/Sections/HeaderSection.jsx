import React, { useEffect, useRef } from 'react';
import Typed from "typed.js";
import ParticleBackground from '@/Components/ParticleBackground';
import axios from 'axios';

const HeaderSection = ({data, userName, cv, language}) => {
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
  }, [section, language]);

  const handleDownload = async () => {
    if (cv !== null) {
      try {
        const response = await axios.get(`/download-cv/${cv.id}`, {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', cv.name);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Error downloading the CV', error);
      }
    }
  };



  return (
    <div className="relative flex items-center justify-center h-screen">
            <div className="absolute top-50 left-50 text-white z-50 text-center">
              <div className="text-3xl" ref={el} />
              <button onClick={handleDownload} className="uppercase border-2 p-3 mt-3 hover:border-highlight hover:text-highlight transition duration-500 ease-in-out" as="button" preserveScroll >{section.btnText}</button>
            </div>
        <ParticleBackground />
    </div>
  )
}

export default HeaderSection