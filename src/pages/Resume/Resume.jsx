import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { v4 as uuidv4 } from 'uuid';
import { getAllEd, getAllJobs, getPersonalInfo } from '../../api/firebaseApi';
import { displayMonth, sortByStartDate, sortByYear } from '../../utils/arrayUtils';
import logo from '../../assets/MainLogoBlue.png';
import './Resume.scss';

// Define background change
const bodyStyle = `body { background-image: url('/public-images/resume.jpeg'); background-position: bottom; transition: all 1s ease-in-out;}`;

// Define screen sizes
const screens = {
    small: window.matchMedia("all and (max-device-width: 640px)").matches,
    tabletPort: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: portrait)").matches,
    tabletLand: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: landscape)").matches,
    medium: window.matchMedia("all and (min-device-width: 1025px) and (max-device-width: 1919px)").matches,
    large: window.matchMedia("all and (min-device-width: 1920px) and (max-device-width: 2559px)").matches,
    xlarge: window.matchMedia("all and (min-device-width: 2560px)").matches,
};

// Page to view resume details
export const Resume = (props) => {
    // Get props
    const { sideBarOpen, alert } = props;
    const [screenSize, setScreenSize] = useState(screens);
    const [myInfo, setMyInfo] = useState({});
    const [jobData, setJobData] = useState([]);
    const [education, setEducation] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const screenSizes = {
            small: window.matchMedia("all and (max-device-width: 640px)").matches,
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

    const fetchData = useCallback(async () => {
        const payload = [];
        const info = await getPersonalInfo();
        if (info[0]) {
            setMyInfo(info[1]);
        } else {
            payload.push({
                id: uuidv4(),
                type: 'error',
                message: info[1],
            });
        }

        const jobs = await getAllJobs();
        if (jobs[0]) {
            const sortedData = sortByStartDate(jobs[1]).reverse();
            setJobData(sortedData);
        } else {
            payload.push({
                id: uuidv4(),
                type: 'error',
                message: jobs[1],
            });
        }

        const ed = await getAllEd();
        if (ed[0]) {
            const sortedData = sortByYear(ed[1])
            setEducation(sortedData);
        } else {
            payload.push({
                id: uuidv4(),
                type: 'error',
                message: ed[1],
            });
        }

        if (payload.length > 0) {
            alert(payload);
        }
    }, [alert]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleResumeClick = (uuid) => {
        navigate(`/resume/jobs/details?uuid=${uuid}`);
    };

    const handleEdClick = (uuid) => {
        navigate(`/resume/education/details?uuid=${uuid}`);
    };

    return (
        <section id="resume-section" style={{width: sideBarOpen ? '84%' : '97%'}}>
            <Helmet>
                <title>Alex Bailey Resume | Resume</title>
                <style>{bodyStyle}</style>
            </Helmet>

            <div id="resume-title-div" className="resume-title">
                <img src={logo} alt="abr-logo.png" />
                {myInfo && (
                    <h3>{myInfo.city}, {myInfo.state} {myInfo.zipcode}</h3>                    
                )} 
            </div>

            <div id="resume-wrapper-div" className="resume-wrapper-div">
                <div id="resume-content" className="resume-content">
                    <div className="blue-card">
                        <p>
                            I graduated from College of Charleston in winter 2022 with a Bachelor's of Arts in Computer Science. Following experiences with companies such as Booz Allen Hamilton and Capgemini as well as being an Eagle Scout, I have developed a strong work ethic, communication, critical-thinking and analysis skills.
                        </p>
                    </div>

                    <div className="table-wrapper">
                        <h1>Job Experience</h1>
                        <table>
                            <thead>
                            <tr>
                                <th>Job Title</th>
                                <th>Company</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                {jobData.length > 0 && jobData.map((job) => (
                                    <tr>
                                        <td>{job.title}</td>
                                        <td>{job.company}</td>
                                        <td>
                                            {displayMonth(job.startDate.month)} {job.startDate.year}
                                        </td>
                                        <td>
                                            {job.endDate ? `${displayMonth(job.endDate.month)} ${job.endDate.year}` : 'Present'}
                                        </td>
                                        <td>
                                            <button className="main-button" onClick={() => handleResumeClick(job.uuid)}>
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-wrapper">
                        <h1>Education</h1>
                        <table>
                            <thead>
                            <tr>
                                <th>Instituion</th>
                                <th>Type</th>
                                <th>Major</th>
                                <th>Graduation Year</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                {education.length > 0 && education.map((ed) => (
                                    <tr>
                                        <td>{ed.institution}</td>
                                        <td>{ed.type}</td>
                                        <td>{ed.major ? ed.major : 'N/A'}</td>
                                        <td>{ed.graduation}</td>
                                        <td>{ed.status ? 'Completed' : 'In Progress'}</td>
                                        <td>
                                            <button className="main-button" onClick={() => handleEdClick(ed.uuid)}>
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div id="skills-card" className={`blue-card${screenSize.small ? ' mobile' : ''}`}>
                        <div className="list-wrapper">
                            <h1>Skills</h1>
                            <ul id="skills-list">
                                <details id="compsci">
                                    <summary>Computer Programming</summary>
                                    <ul>
                                        <li>Proficient in Java, JavaScript, Typescript, Python, PHP, Go, Kotlin, and C</li>
                                        <li>Experience in Android App Development</li>
                                        <li>
                                            Experience in Web Development/Database Server Communication (React, Spring Boot, SQL, MariaDB)
                                        </li>
                                        <li>
                                            Certification in React from <a href="https://www.coursera.org/" target="_blank" rel="noreferrer">Coursera</a>
                                        </li>
                                    </ul>
                                </details>
                                <li>Strong communication/public speaking skills</li>
                                <li>Leadership</li>
                                <li>Strong work ethic</li>
                                <li>Practiced in Scrum Development Process</li>
                            </ul>
                        </div>

                        <div className="list-wrapper">
                            <h1>Activities</h1>
                            <details>
                                <summary>Member of Boy Scouts of America (2009-2019)</summary>
                                <ul>
                                    <li>Eagle Scout (2017)</li>
                                    <li>Eagle Scout Service Project: built 4 twin size beds for Charleston Halos (2017)</li>
                                    <li>Assistant Scout Master (2019)</li>
                                </ul>
                            </details>

                            <details>
                                <summary>Adult Black Belt in American Karate and Taekwondo (2014)</summary>
                                <ul><li>Low Country Karate</li></ul>
                            </details>

                            <details>
                                <summary>Practiced Musician: Tuba, Bass Guitar, and Bass Trombone</summary>
                                <details>
                                    <summary>College</summary>
                                    <ul>
                                        <li>College of Charleston Athletic Band: Chucktown Sound (2018-Present)</li>
                                        <ul>
                                            <li>Tuba Section Leader (2020-2022)</li>
                                        </ul>
                                        <li>College of Charleston Orchestra (2018-2023)</li>
                                        <ul>
                                            <li>Principal Tubist (2020-2021)</li>
                                            <li>Bass Trombonist (2018-2019 & 2022-2023)</li>
                                        </ul>
                                        <li>College of Charleston Wind Ensemble (2018-Present)</li>
                                    </ul>
                                </details>

                                <details>
                                    <summary>High School</summary>
                                    <ul>
                                        <li>Marching Band (2014-2017)</li>
                                        <ul><li>Tuba Section Leader (2016 & 2017)</li></ul>
                                        <li>Symonic Band (2016-2018)</li>
                                        <li>Concert Band I (2015-2016)</li>
                                        <li>Concert Band II (2014-2015)</li>
                                        <li>Wando Jazz Band (2016-2018)</li>
                                    </ul>
                                </details>
                            </details>
                        </div>

                        <div className="list-wrapper">
                            <h1>Leadership Experience</h1>
                            <details>
                                <summary><strong>R.I.S.E Leadership Program</strong> - Capgemini</summary>
                                <ul>
                                    <li>
                                        <font className="verb">Collaborated </font>
                                        with 7 team members and consultants to problem-solve a technical statement
                                        <font className="action"> to present a solution to panel of 5 judges.</font>
                                    </li>
                                    <li>
                                        <font className="verb">Demonstrated </font>
                                        leadership by providing business strategy and structure
                                        <font className="action"> to execute mobile app design.</font>
                                    </li>
                                    <li>
                                        <font className="verb">Researched </font>
                                        useful information 
                                        <font className="action"> to make educated decisions.</font>
                                    </li>
                                </ul>
                            </details>

                            <details>
                                <summary>Tuba Section Leader – Wando High School (2016-2018) & Chucktown Sound (2020-Present)</summary>
                                <ul>
                                    <li>
                                        <font className="verb">Instructed </font>
                                        other section members
                                        <font className="action"> to improve musical skills and technical skills.</font>
                                    </li>
                                    <li>
                                        <font className="verb">Demonstrated </font>
                                        leadership by setting the example for etiquette and technique
                                        <font className="action"> to help guide the section.</font>
                                    </li>
                                    <li>
                                        <font className="verb">Innovated </font>
                                        new systems
                                        <font className="action"> to aid in learning processes and improve communication.</font>
                                    </li>
                                </ul>
                            </details>

                            <details>
                                <summary>
                                    Eagle Scout, Order of the Arrow, Senior Patrol Leader, Patrol Leader, Webmaster – BSA Troop 11
                                </summary>
                                <ul>
                                    <li>
                                        <font className="verb">Organized </font>
                                        weekly troop meetings and monthly camping events
                                        <font className="action"> to ensure troop activities run smoothly.</font>
                                    </li>
                                    <li>
                                        <font className="verb">Educated </font>
                                        other scouts on various topics
                                        <font className="action"> to improve the skills of my fellow scouts.</font>
                                    </li>
                                    <li>
                                        <font className="verb">Assisted </font>
                                        my community through service projects such as my Eagle Scout Project
                                        <font className="action"> to improve the lives of those in need.</font>
                                    </li>
                                </ul>
                            </details>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
