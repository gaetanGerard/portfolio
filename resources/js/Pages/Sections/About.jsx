import React from 'react'
import { convertToRaw, convertFromRaw  } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

const About = ({ description, picture}) => {
    const rawContentState = JSON.parse(description);
    const contentState = convertFromRaw(rawContentState);

    const markup = draftToHtml(convertToRaw(contentState));
  return (
    <div id="about" className="bg-custom-dark text-white w-full h-full  p-5">
        <div className="grid grid-cols-2 gap-3 place-content-center place-items-center p-5 shadow-2xl shadow-black rounded-lg">
            <img src={picture} className="w-50 object-contain rounded-full drop-shadow-2xl" alt="Profile picture" />
            <div dangerouslySetInnerHTML={{ __html: markup }} className="grid grid-flow-row gap-4" />
        </div>
    </div>
  )
}

export default About