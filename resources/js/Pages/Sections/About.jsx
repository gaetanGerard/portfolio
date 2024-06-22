import React from 'react'
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../utils/motion';
import { convertToRaw, convertFromRaw  } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

const About = ({ description, picture}) => {
    const rawContentState = JSON.parse(description);
    const contentState = convertFromRaw(rawContentState);

    const markup = draftToHtml(convertToRaw(contentState));
  return (
    <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
    >
        <motion.div
            id="about"
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
            className="bg-custom-dark text-white w-full h-full  p-5"
        >
            <motion.div
                variants={fadeIn('right', 'spring', 0.5, 0.75)}
                className="grid sm:grid-flow-row lg:grid-cols-2 gap-3 place-content-center place-items-center p-5 shadow-2xl shadow-black rounded-lg"
            >
                <img src={picture} className="w-50 object-contain rounded-full drop-shadow-2xl" alt="Profile picture" />
                <div dangerouslySetInnerHTML={{ __html: markup }} className="grid grid-flow-row gap-4" />
            </motion.div>
        </motion.div>
    </motion.section>

  )
}

export default About