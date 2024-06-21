import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
import AccordionContent from './AccordionContent';

const Accordion = ({ i, expanded, setExpanded, project, data }) => {
    const isOpen = i === expanded;
    return (
        <>
        <AnimatePresence initial={false}>
            {isOpen === true ? (
                <motion.div
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    onClick={() => setExpanded(isOpen ? false : i)}
                    className={`relative ${
                            expanded === project.id ? 'lg:flex-[3.5] flex-[10]' : 'lg:flex-[0.5] flex-[2]'
                        } flex items-center justify-center min-w-[170px]
                        h-[400px] cursor-pointer mb-3`}
                >


                    <motion.section
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                        open: { opacity: 1, width: "500px" },
                        collapsed: { opacity: 0, width: "125px" }
                        }}
                        className="lg:w-full h-full rounded-lg overflow-hidden card-shadow "
                    >
                        <AccordionContent project={project} data={data} />
                    </motion.section>


            </motion.div>) : (
                <motion.div
                    initial={false}
                    onClick={() => setExpanded(isOpen ? false : i)}
                    className={`group relative ${
                                expanded === project.id ? 'lg:flex-[3.5] flex-[10]' : 'lg:flex-[0.5] flex-[2]'
                            } flex items-center justify-center max-w-[170px]
                            h-[400px] cursor-pointer mb-3`}
                >
                    <img src={project.main_img} alt={project.title} className="object-cover h-full w-full rounded-lg grayscale group-hover:grayscale-0 transition ease-in-out delay-300" />
                    <div className="flex items-center justify-start pr-[4.5rem]">
                        <h3
                            className="font-extrabold font-beckman uppercase w-[200px] h-[30px]
                        whitespace-nowrap sm:text-[27px] text-[18px] text-timberWolf tracking-[1px]
                        absolute z-0 lg:bottom-[7rem] lg:rotate-[-90deg] lg:origin-[0,0]
                        leading-none z-20 group-hover:text-highlight transition ease-in-out delay-300">
                            {project.title}
                        </h3>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    )
}

export default Accordion