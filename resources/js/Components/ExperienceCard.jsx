import React, { useState, useEffect } from 'react';
import { VerticalTimelineElement } from 'react-vertical-timeline-component';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/fr';
import WorkIcon from '@mui/icons-material/Work';
import { convertToRaw, convertFromRaw  } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

dayjs.extend(localizedFormat);

const ExperienceCard = ({ experience, language, section }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const rawContentState = JSON.parse(experience.description);
    const contentState = convertFromRaw(rawContentState);

    const markup = draftToHtml(convertToRaw(contentState));

    useEffect(() => {
        dayjs.locale(language ==="fr" ? 'fr' : 'en');
    }, [language])

    const startDateFormatted = dayjs(experience.start_date).format('MMM YYYY');
    const endDateFormatted = experience.is_current ? 'PRESENT' : dayjs(experience.end_date).format('MMM YYYY');
    const displayedDate = `${startDateFormatted} - ${endDateFormatted}`;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

  return (
    <VerticalTimelineElement
        contentStyle={{
            background: '#eaeaec',
            color: '#292929',
            boxShadow:
                'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        }}
        contentArrowStyle={{
            borderRight: '7px solid  #eaeaec',
        }}
        date={
            <div>
                <h3 className="text-dim text-[18px] font-bold font-beckman">
                {displayedDate}
                </h3>
            </div>
        }
        iconStyle={{ background: '#eaeaec', color: '#252934' }}
        icon={<WorkIcon />}
    >
        <div>
        <h3 className="text-jetLight text-[24px] font-bold font-beckman tracking-[2px]">
            {experience.job_title}
        </h3>
        <p
            className="text-taupe text-[22px] font-semibold font-overcameBold tracking-[1px]"
            style={{ margin: 0 }}>
            {experience.company_name}
        </p>
        {isExpanded ? (
            <div>
                <div dangerouslySetInnerHTML={{ __html: markup }} className="thatIsJustBecauseImDoneForToday" />
                <button onClick={toggleExpand} className="expand-button">
                    <ExpandLessIcon /> {section.btnSeeLess}
                </button>
            </div>
        ) : (
            <button onClick={toggleExpand} className="expand-button">
                <ExpandMoreIcon /> {section.btnSeeMore}
            </button>
        )}
        </div>
    </VerticalTimelineElement>
  )
}

export default ExperienceCard