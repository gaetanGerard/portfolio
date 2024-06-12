import React, { useState } from 'react';
import { Link   } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import SwitchLanguage from '@/Components/SwitchLanguage';

const Nav = ({data, language, changeLocaleLanguage}) => {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const navItems = Object.values(data.nav);

  return (
    <nav className="bg-dark border-b border-dark text-white fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex">
                    <div className="shrink-0 flex items-center">
                        <Link href="/">
                            <ApplicationLogo className="block h-9 w-auto fill-current text-white" />
                        </Link>
                    </div>

                    <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                    {navItems.map((item, index) => (
                        <NavLink
                            href={`${item.href}`}
                            key={index}
                            className="text-white"
                        >
                            {item.label}
                        </NavLink>
                    ))}
                    </div>
                </div>

                <div className="hidden sm:flex sm:items-center sm:ms-6">
                    <div className="ms-3 relative">
                        <SwitchLanguage localeLanguage={language}  changeLocaleLanguage={changeLocaleLanguage}  />
                    </div>
                </div>

                <div className="-me-2 flex items-center sm:hidden">
                    <button
                        onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                    >
                        <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path
                                className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                            <path
                                className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
            <div className="pt-2 pb-3 space-y-1">
                {navItems.map((item, index) => (
                    <ResponsiveNavLink
                        href={`${item.href}`}
                        key={index}
                        className="text-white hover:bg-dark"
                    >
                        {item.label}
                    </ResponsiveNavLink>
                ))}
                <div className="ms-3 relative">
                    <SwitchLanguage localeLanguage={language}  changeLocaleLanguage={changeLocaleLanguage}  />
                </div>
            </div>
        </div>
    </nav>
  )
}

export default Nav