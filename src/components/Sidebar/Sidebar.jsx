import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TfiArrowCircleLeft } from 'react-icons/tfi';
import { AiFillHome, AiOutlineMessage } from 'react-icons/ai';
import { BsInfoCircle, BsFillBriefcaseFill } from 'react-icons/bs';
import { FaBars, FaReact, FaGithub, FaCar, FaMicrochip } from 'react-icons/fa6';
import { GiMusicalNotes } from 'react-icons/gi';
import { ImProfile } from 'react-icons/im';
import { IoBuild } from 'react-icons/io5';
import { IoIosLaptop } from 'react-icons/io';
import { IconContext } from 'react-icons/lib';
import { 
    MdAccountCircle,
    MdClose, 
    MdOutlineSpaceDashboard,
} from 'react-icons/md';
import { PiDesktopTowerDuotone } from 'react-icons/pi';
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';
import MobileSubMenu from './MobileSubMenu'
import logo from '../../assets/MainLogoWhite.png';
import pfp from '../../assets/image-placeholder.jpeg';
import { v4 as uuidv4 } from 'uuid';
import { sendLogOut } from '../../api/firebaseApi';
import './Sidebar.scss';

// Define screen sizes
const screens = {
    tabletPort: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: portrait)").matches,
    tabletLand: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: landscape)").matches,
    medium: window.matchMedia("all and (min-device-width: 1025px) and (max-device-width: 1919px)").matches,
    large: window.matchMedia("all and (min-device-width: 1920px) and (max-device-width: 2559px)").matches,
    xlarge: window.matchMedia("all and (min-device-width: 2560px)").matches,
};

const openGit = () => window.open('https://github.com/baileyam99', '_blank');

// Component for sidebar navigation
export function Sidebar(props) {
    // Get props and initialize state variable
    const { account, alert, isOpen, changeOpen, user, setUser } = props;
    const [projectExpanded, setProjectExpanded] = useState(false);
    const [hardwareExpanded, setHardwareExpanded] = useState(false);
    const [screenSize, setScreenSize] = useState(screens);
    const [width, setWidth] = useState('3%');
    const [widthOpen, setWidthOpen] = useState('15%');
    const name = `${account?.FirstName} ${account?.LastName}`

    useEffect(() => {
        const screenSizes = {
            tabletPort: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: portrait)").matches,
            tabletLand: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: landscape)").matches,
            medium: window.matchMedia("all and (min-device-width: 1025px) and (max-device-width: 1919px)").matches,
            large: window.matchMedia("all and (min-device-width: 1920px) and (max-device-width: 2559px)").matches,
            xlarge: window.matchMedia("all and (min-device-width: 2560px)").matches,
        };
        const keys = Object.keys(screenSizes);

        const prev = {...screenSizes}
        const prevKeys = Object.keys(prev);
        for (let i = 0; i < prevKeys.length; i++) {
            if (screenSizes[keys[i]] !== prev[prevKeys[i]]) {
                prev[prevKeys[i]] = screenSizes[keys[i]];
            }
        }
        setScreenSize(prev);
    }, []);

    useEffect(() => {
        if (screenSize.tabletPort) {
            setWidth('5%');
            setWidthOpen('25%');
        } else if (screenSize.tabletLand) {
            setWidth('5%');
            setWidthOpen('18%');
        } else {
            setWidth('3%');
            setWidthOpen('15%');
        }
    }, [screenSize]);

    // Function to handle opening and closing the sidebar
    const openerHandler = () => {
        changeOpen();
    };

    const projectExpandHandler = () => {
        setProjectExpanded(!projectExpanded);
    };

    const hardwareExpandHandler = () => {
        setHardwareExpanded(!hardwareExpanded);
    };

    // Function to handle log out
    const logOutHandler = async () => {
        const loggedOut = await sendLogOut();
        if (loggedOut[0]) {
            const alertPayload = {
                id: uuidv4(),
                type: 'success',
                message: 'You have been successfully logged out.',
            };
            setUser(undefined);
            alert(alertPayload);
        } else {
            const alertPayload = {
                id: uuidv4(),
                type: 'error',
                message: `${loggedOut[1]}`,
            };
            alert(alertPayload);
        }
    };

    return (
        <section id="sidebar" style={{width: isOpen ? widthOpen : width}} className={isOpen ? '' : 'glass'}>
            <div id="nav-control-div" className={`nav-control-div ${isOpen ? 'closed' : ''}`}>
                <IconContext.Provider value={{className: `arrow ${isOpen ? 'rotate' : ''}`}}>
                    {isOpen ? <img src={logo} alt="logo.png" /> : <></>}
                    <h1 className="logo-font">
                        <TfiArrowCircleLeft style={{fontSize: 25}} onClick={openerHandler} />
                    </h1>
                </IconContext.Provider>
            </div>
            <hr style={{margin: isOpen ? '0 1em 20px 1em' : '0 7px 5px 7px'}} />
            {isOpen && (
                <div id="nav-list">
                    <Link to={`/${'dashboard'}`}>
                        <div id="account-card" className="account-card">
                            <img src={pfp} alt="task-master-logo.png" />
                            {!!user
                                ? <span>
                                    <h5>{name}</h5>
                                    {account.Admin && (
                                        <p>
                                            Admin • <span className="logout" onClick={logOutHandler}>Log Out</span>
                                        </p>
                                    )}
                                    {!account.Admin && (
                                        <p className="mini">
                                            User • <Link to="#" className="logout" onClick={logOutHandler}>Log Out</Link>
                                        </p>
                                    )}
                                </span>
                                : <span>
                                    <Link to="/login">Log In</Link> / <Link to="/create-account">Create</Link>
                                </span>
                            }
                        </div>
                    </Link>
                    <Link to="/home">
                        <div id="home-nav" className="nav-button">
                            <AiFillHome id="home-nav-icon" />
                            <span>Home</span>
                        </div>
                    </Link>
                    {!!user && (
                        <Link to="/dashboard">
                            <div id="dashboard-nav" className="nav-button">
                                <MdOutlineSpaceDashboard id="dashboard-nav-icon" />
                                <span>Dashboard</span>
                            </div>
                        </Link>
                    )}
                    <Link to="/resume">
                        <div id="resume-nav" className="nav-button">
                            <ImProfile id="resume-nav-icon" />
                            <span>Resume</span>
                        </div>
                    </Link>
                    <Link to="/about">
                        <div id="about-nav" className="nav-button">
                            <BsInfoCircle id="about-nav-icon" />
                            <span>About Me</span>
                        </div>
                    </Link>
                    <Link to="#" onClick={projectExpandHandler}>
                        <div id="projects-nav" className="nav-button">
                            <IoBuild id="projects-nav-icon" />
                            <span>Projects</span>
                            <RiArrowDownSFill 
                                id="projects-nav-expand-icon" 
                                className={`expand-icon ${projectExpanded ? 'flip' : ''}`} 
                            />
                        </div>
                    </Link>
                    {projectExpanded && (
                        <Link to="#" onClick={openGit}>
                            <div id="github-nav" className="nav-button sub-nav">
                                <FaGithub id="github-nav-icon" />
                                <span>GitHub</span>
                            </div>
                        </Link>
                    )}
                    {projectExpanded && (
                        <Link to="/projects?project=soteria-cat">
                            <div id="soteria-cat-nav" className="nav-button sub-nav">
                                <BsFillBriefcaseFill id="soteria-cat-nav-icon" />
                                <span>Soteria Cat</span>
                            </div>
                        </Link>
                    )}
                    {projectExpanded && (
                        <Link to="/projects?project=spot-finder">
                            <div id="spot-finder-nav" className="nav-button sub-nav">
                                <FaCar id="spot-finder-nav-icon" />
                                <span>Spot Finder</span>
                            </div>
                        </Link>
                    )}
                    {projectExpanded && (
                        <Link to="/projects?project=resume-site">
                            <div id="resume-site-nav" className="nav-button sub-nav">
                                <FaReact id="resume-site-nav-icon" />
                                <span>Resume Site</span>
                            </div>
                        </Link>
                    )}
                    {projectExpanded && (
                        <Link to="/projects?project=chucktown-sound">
                            <div id="cts-nav" className="nav-button sub-nav">
                                <GiMusicalNotes id="cts-nav-icon" />
                                <span>CTS</span>
                            </div>
                        </Link>
                    )}
                    <Link to="#" onClick={hardwareExpandHandler}>
                        <div id="hardware-nav" className="nav-button">
                            <FaMicrochip id="hardware-nav-icon" />
                            <span>Hardware</span>
                            <RiArrowDownSFill 
                                id="hardware-nav-expand-icon" 
                                className={`expand-icon ${hardwareExpanded ? 'flip' : ''}`} 
                            />
                        </div>
                    </Link>
                    {hardwareExpanded && (
                        <Link to="/hardware/desktop">
                            <div id="desktop-nav" className="nav-button sub-nav">
                                <PiDesktopTowerDuotone id="desktop-nav-icon" />
                                <span>Desktop</span>
                            </div>
                        </Link>
                    )}
                    {hardwareExpanded && (
                        <Link to="/hardware/laptop">
                            <div id="laptop-nav" className="nav-button sub-nav">
                                <IoIosLaptop id="laptop-nav-icon" />
                                <span>Laptop</span>
                            </div>
                        </Link>
                    )}
                    <Link to="/contact">
                        <div id="contact-nav" className="nav-button">
                            <AiOutlineMessage id="contact-nav-icon" />
                            <span>Contact Me</span>
                        </div>
                    </Link>
                    <Link to="report-a-problem-form">
                        <div id="report-a-problem-link" className="nav-link">
                            <p>Report a Problem</p>
                        </div>
                    </Link>
                    <div id="version-number" className="build">
                        <p>v{process.env.REACT_APP_VERSION}</p>
                    </div>
                </div>
            )}

            {!isOpen && (
                <div id="nav-list" className="nav">
                    <IconContext.Provider value={{className: 'nav-icons'}}>
                        <Link to={`/${'dashboard'}`}>
                            <MdAccountCircle />
                        </Link>
                        <hr style={{margin: '2.5px 7px'}} />
                        <Link to="/home">
                            <AiFillHome id="home-nav-icon" />
                        </Link>
                        {!!user && (
                            <Link to="/dashboard">
                                <MdOutlineSpaceDashboard id="dashboard-nav-icon" />
                            </Link>
                        )}
                        <Link to="/resume">
                            <ImProfile id="resume-nav-icon" />
                        </Link>
                        <Link to="/about">
                            <BsInfoCircle id="about-nav-icon" />
                        </Link>
                        <hr style={{margin: '2.5px 7px'}} />
                        <Link to="#" onClick={projectExpandHandler}>
                            <IoBuild id="project-nav-icon" />
                        </Link>
                        {projectExpanded && (
                            <Link to="#" onClick={openGit}>
                                <FaGithub id="photos-nav-icon" className="fade" />
                            </Link>
                        )}
                        {projectExpanded && (
                            <Link to="/projects/soteria-cat">
                                <BsFillBriefcaseFill id="soteria-cat-nav-icon" className="fade" />
                            </Link>
                        )}
                        {projectExpanded && (
                            <Link to="/projects/spot-finder">
                                <FaCar id="spot-finder-nav-icon" className="fade" />
                            </Link>
                        )}
                        {projectExpanded && (
                            <Link to="/projects/resume-site">
                                <FaReact id="resume-site-nav-icon" className="fade" />
                            </Link>
                        )}
                        {projectExpanded && (
                            <Link to="/projects/cts">
                                <GiMusicalNotes id="cts-nav-icon" className="fade" />
                            </Link>
                        )}
                        <hr style={{margin: '2.5px 7px'}} />
                        <Link to="#" onClick={hardwareExpandHandler}>
                            <FaMicrochip id="hardware-nav-icon" />
                        </Link>
                        {hardwareExpanded && (
                            <Link to="/hardware/laptop">
                                <IoIosLaptop id="laptop-nav-icon" className="fade" />
                            </Link>
                        )}
                        {hardwareExpanded && (
                            <Link to="/hardware/desktop">
                                <PiDesktopTowerDuotone id="desktop-nav-icon" className="fade" />
                            </Link>
                        )}
                        <hr style={{margin: '2.5px 7px'}} />
                        <Link to="/contact">
                            <AiOutlineMessage id="contact-nav-icon" />
                        </Link>
                    </IconContext.Provider>
                </div>
            )}
        </section>
    );
};

// Define the navigation options for the mobile sidebar
const SidebarMobileData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiFillHome />
    },
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <MdOutlineSpaceDashboard />
    },
    {
        title: 'Resume',
        path: '/resume',
        icon: <ImProfile />
    },
    {
        title: 'About Me',
        path: '/about',
        icon: <BsInfoCircle />
    },
    {
        title: 'Projects',
        path: '#',
        icon: <IoBuild />,
        iconClosed: <RiArrowDownSFill />,
        iconOpened: <RiArrowUpSFill />,
        subNav: [
            {
                title: 'GitHub',
                path: '#',
                onClick: openGit,
                icon: <FaGithub />
            },
            {
                title: 'Soteria Cat',
                path: '/projects/soteria-cat',
                icon: <BsFillBriefcaseFill />
            },
            {
                title: 'Spot Finder',
                path: '/projects/spot-finder',
                icon: <FaCar />
            },
            {
                title: 'Resume Site',
                path: '/projects/resume-site',
                icon: <FaReact />
            },
            {
                title: 'CTS',
                path: '/projects/cts',
                icon: <GiMusicalNotes />
            },
        ]
    },
    {
        title: 'Hardware',
        path: '#',
        icon: <FaMicrochip />,
        iconClosed: <RiArrowDownSFill />,
        iconOpened: <RiArrowUpSFill />,
        subNav: [
            {
                title: 'Laptop',
                path: '/hardware/laptop',
                icon: <IoIosLaptop />
            },
            {
                title: 'Desktop',
                path: '/hardware/desktop',
                icon: <PiDesktopTowerDuotone />
            },
        ]
    },
    {
        title: 'Contact Me',
        path: '/contact',
        icon: <AiOutlineMessage />
    },
];

// Component for the mobile sidebar
export const SidebarMobile = () => {
    // Initialize state variables
    const [isOpen, setIsOpen] = useState(false);
    const [visable, setVisible] = useState(true);

    // Function to toggle sidebar button visibility based on how far the user scrolls
    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 25){
            setVisible(false)
        } 
        else if (scrolled <= 25){
            setVisible(true)
        }
    };

    // Event listener for scrolling
    window.addEventListener('scroll', toggleVisible);

    // Function to handle opening and closing the sidebar
    const openerHandler = () => {
        setIsOpen(!isOpen);
    };

    // Mouse leave bars negation
    const mouseLeaver = () => {
        setIsOpen(false);
    };

    // Mouse leave bars negation
    const mouseEnter = () => {
        setIsOpen(true);
    };

    return (
        <>
            <div id="nav-bars" className="nav-bars-div" onClick={openerHandler} onMouseLeave={mouseLeaver}>
                <Link to="#">
                    <IconContext.Provider value={{className: visable ? 'bars' : 'bars invisible'}}>
                        <FaBars />
                    </IconContext.Provider>
                </Link>
            </div>
            <nav style={{left: isOpen ? '0' : '-100%'}}>
                <div className="sidebar-wrap-div" onMouseEnter={mouseEnter} onMouseLeave={mouseLeaver}>
                    <div className="close-div">
                        <Link to="#" onClick={openerHandler}>
                            <MdClose />
                        </Link>
                    </div>
                        
                    {SidebarMobileData.map((item, index) => {
                        return <MobileSubMenu item={item} key={index} />;
                    })}

                    <div id="version-number" className="build">
                        <p>v{process.env.REACT_APP_VERSION}</p>
                    </div>
                </div>
            </nav>
        </>
    );
};
