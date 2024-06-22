import React from 'react'
import ApplicationLogo from '@/Components/ApplicationLogo';
import { email, linkedin, github } from '@/assets';
import Link from '@mui/material/Link';

const Footer = ({data}) => {
  return (
    <div className="bg-custom-dark text-white w-full h-full p-5 grid grid-cols-3 gap-3 content-center items-center">
        <ApplicationLogo className="block h-12 w-auto fill-current text-white" />
        <div className="text-center text-xs self-end">
            <p>{data.footer.copyRight}</p>
            <p>{data.footer.madeBy}</p>
        </div>
        <div>
            <h5>{data.social.contactUs}</h5>
            <div className="flex gap-2 justify-start m-2">
                <Link href={data.social.email.href} target="_blank">
                    <img src={email} alt="email" className="w-7 h-7" />
                </Link>
                <Link href={data.social.linkedin.href} target="_blank">
                    <img src={linkedin} alt="linkedin" className="w-7 h-7" />
                </Link>
                <Link href={data.social.github.href} target="_blank">
                    <img src={github} alt="github" className="w-6 h-6" />
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Footer