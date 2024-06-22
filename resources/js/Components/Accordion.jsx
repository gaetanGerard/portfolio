import React from 'react'
import { motion } from 'framer-motion';
import { github, website } from '../assets/index';
import { fadeIn } from '../utils/motion';
import { convertToRaw, convertFromRaw  } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

const Accordion = ({
    project,
    index,
    active,
    handleClick,
  }) => {
    const rawContentState = JSON.parse(project.description);
    const contentState = convertFromRaw(rawContentState);

    const markup = draftToHtml(convertToRaw(contentState));
    return (
      <motion.div
        variants={fadeIn('right', 'spring', index * 0.5, 0.75)}
        className={`relative ${
          active === project.id ? 'lg:flex-[3.5] flex-[10] lg:max-w-[500px] sm:w-full' : 'lg:flex-[0.5] flex-[2] w-full lg:w-[170px]'
        } flex items-center justify-center
        h-[420px] cursor-pointer card-shadow`}
        onClick={() => handleClick(project.id)}>
        <div
          className="absolute top-0 left-0 z-10 bg-jetLight
        h-full w-full opacity-[0.5] rounded-[24px]"></div>

        <img
          src={project.main_img}
          alt={project.title}
          className="absolute w-full h-full object-cover rounded-[24px]"
        />

        {active !== project.id ? (
          <div className="flex items-center justify-start pr-[4.5rem]">
            <h3
              className="font-extrabold font-beckman uppercase w-[200px] h-[45px]
          whitespace-nowrap sm:text-[27px] text-[18px] text-timberWolf tracking-[1px]
          absolute z-0 lg:bottom-[7rem] lg:rotate-[-90deg] lg:origin-[0,0]
          leading-none z-20">
              {project.title}
            </h3>
          </div>
        ) : (
          <>
            <div
              className="absolute bottom-0 p-8 justify-start w-full
              flex-col bg-[rgba(122,122,122,0.5)] rounded-b-[24px] lg:w-[500px] w-full z-20">
              <div className="absolute inset-0 flex justify-end m-3">
                {project.github_repo !== null ? (<div
                  onClick={() => window.open(project.github_repo, '_blank')}
                  className="bg-custom-dark sm:w-11 sm:h-11 w-10 h-10 rounded-full
                    flex justify-center items-center cursor-pointer
                    sm:opacity-[0.9] opacity-[0.8]">
                  <img
                    src={github}
                    alt="source code"
                    className="w-4/5 h-4/5 object-contain fill-white"
                  />
                </div>) : null}
              </div>

              <h2
                className="font-bold sm:text-[32px] text-[24px]
                text-timberWolf uppercase font-beckman sm:mt-0 -mt-[1rem]">
                {project.title}
              </h2>
              <p
                dangerouslySetInnerHTML={{ __html: markup }}
                className="text-silver sm:text-[14px] text-[12px]
                max-w-3xl sm:leading-[24px] leading-[18px]
                font-poppins tracking-[1px]" />
              {project.demo_link !== null ? (<button
                className="live-demo flex justify-start
                sm:text-[16px] text-[14px] text-timberWolf
                font-bold font-beckman items-center p-2
                whitespace-nowrap gap-1 sm:w-[115px] sm:h-[50px]
                w-[115px] h-[46px] rounded-[10px] glassmorphism
                sm:mt-[22px] mt-[16px] hover:bg-highlight
                hover:text-white transition duration-[0.2s]
                ease-in-out"
                onClick={() => window.open(project.demo_link, '_blank')}>
                <img
                  src={website}
                  alt="website"
                  className="btn-icon sm:w-[34px] sm:h-[34px]
                    w-[30px] h-[30px] object-contain"
                />
                DEMO
              </button>) : null}
            </div>
          </>
        )}
      </motion.div>
    );
  };

export default Accordion