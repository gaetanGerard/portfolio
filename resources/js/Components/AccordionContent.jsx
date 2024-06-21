import React from 'react';
import { motion } from "framer-motion";
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import LanguageIcon from '@mui/icons-material/Language';
import GitHubIcon from '@mui/icons-material/GitHub';
import Tooltip from '@mui/material/Tooltip';
import { convertToRaw, convertFromRaw  } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

const AccordionContent = ({project, data}) => {
    const rawContentState = JSON.parse(project.description);
    const contentState = convertFromRaw(rawContentState);

    const markup = draftToHtml(convertToRaw(contentState));
    console.log(project);
  return (
    <motion.div
        variants={{ collapsed: { scale: 0.8 }, open: { scale: 1 } }}
        className="content-placeholder relative h-full w-full rounded-lg overflow-hidden"
    >
        <img src={project.main_img} alt={project.title} className="object-cover h-full w-full rounded-lg" />
        <div className="absolute bottom-0 p-6 justify-start w-full
            flex-col bg-[rgba(122,122,122,0.8)] rounded-lg z-20">
                <div className="link-icon absolute top-0 right-0 flex justify-end m-3">
                    {project.github_repo !== null ? (
                        <Tooltip title={data.githubLabel} placement="top" arrow>
                            <IconButton
                                aria-label="detail"
                                variant="contained"
                                href={project.github_repo}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="self-start">
                                    <GitHubIcon fontSize="large" />
                            </IconButton>
                        </Tooltip>
                    ) : null}
                </div>

                <h4
                    className="font-bold sm:text-[32px] text-[24px]
                    text-timberWolf uppercase font-beckman sm:mt-0 -mt-[1rem]">
                    {project.title}
                </h4>
                <div
                    dangerouslySetInnerHTML={{ __html: markup }}
                    className="text-silver sm:text-[14px] text-[12px]
                    max-w-3xl sm:leading-[24px] leading-[18px]
                    font-poppins tracking-[1px]" />
                <button
                    className="live-demo flex justify-center
                    sm:text-[16px] text-[14px] text-timberWolf
                    font-bold font-beckman items-center p-1 pl-2 pr-3
                    whitespace-nowrap gap-1 sm:w-[150px] sm:h-[50px]
                    w-[150px] h-[46px]
                    sm:mt-[22px] mt-[8px] hover:bg-highlight
                    transition duration-[0.2s]
                    ease-in-out border-2"
                    onClick={() => window.open(project.demo_link, '_blank')}>
                    <LanguageIcon fontSize="large"/>
                    LIVE DEMO
                </button>
        </div>
    </motion.div>
  )
}

export default AccordionContent

// L'objectif de ce projet était de réaliser un clone de Netflix en
// utilisant React et Redux ainsi que node-sass pour le style. J'ai également utiliser l'API de TMDB pour récupérer
//  les films et les séries. J'ai utiliser Express ainsi que Apollo GraphQL pour créer les schémas et resolver enfin j'ai utiliser MongoDB pour
//   stocker certaines données.