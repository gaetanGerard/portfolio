import { VerticalTimeline } from 'react-vertical-timeline-component';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import 'react-vertical-timeline-component/style.min.css';
import { textVariant, staggerContainer } from '../../utils/motion';
import ExperienceCard from '@/Components/ExperienceCard';

const Experiences = ({data, experiences, language}) => {
    const sortedExperiences = [...experiences].sort((a, b) => dayjs(b.start_date) - dayjs(a.start_date));
    const section = data.experiences;
    return (
        <motion.section
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.25 }}
        >
            <div id="experiences" className="bg-custom-dark">
                <motion.div variants={textVariant()}>
                    <h2 className={`text-white font-black md:text-[60px] sm:text-[48px] xs:text-[40px] text-[30px] font-poppins sm:pl-16 pl-[2rem] text-center`}>
                        {section.title}
                    </h2>
                </motion.div>
                <div className="mt-20 flex flex-col">
                    <VerticalTimeline className="vertical-timeline-custom-line">
                        {sortedExperiences.map((experience, index) => experience.show === 1 ? (
                            <ExperienceCard key={index} experience={experience} language={language} section={section} />
                        ) : null)}
                    </VerticalTimeline>
                </div>
            </div>
        </motion.section>
    )

}

export default Experiences