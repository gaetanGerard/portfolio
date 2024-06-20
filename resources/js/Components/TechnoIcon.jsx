import React, {useState, useEffect} from 'react';
import Tooltip from '@mui/material/Tooltip';

const TechnoIcon = ({level, url, name, data}) => {
    const [skillLevel, setSkillLevel] = useState('');
    const [skillLevelLabel, setSkillLevelLabel] = useState('');

    useEffect(() => {
        switch(level) {
            case '0':
                setSkillLevel('beginner');
                setSkillLevelLabel(data.skillsLevelLabel.beginner)
                break;
            case '25':
                setSkillLevel('intermediate');
                setSkillLevelLabel(data.skillsLevelLabel.intermediate)
                break;
            case '50':
                setSkillLevel('advance');
                setSkillLevelLabel(data.skillsLevelLabel.advanced)
                break;
            case '75':
                setSkillLevel('expert');
                setSkillLevelLabel(data.skillsLevelLabel.expert)
                break;
            case '100':
                setSkillLevel('master');
                setSkillLevelLabel(data.skillsLevelLabel.master)
                break;
            default:
                setSkillLevel('');
                setSkillLevelLabel('')
                break;
        }
    }
    , [level]);

  return (
    <Tooltip title={`${name} - ${data.skillsLevelLabelText}: ${skillLevelLabel}`} placement="top" arrow>
        <div className={`slide-techno ${skillLevel}`}>
            <div className="logo-container overlay">
            <img src={url} alt={name} className={`logo-overlay logo-${name}`} />
            </div>
            <div className="logo-container">
            <img src={url} alt={name} className={`logo logo-${name}`} />
            </div>
        </div>
    </Tooltip>
  )
}

export default TechnoIcon