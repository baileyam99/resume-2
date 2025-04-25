import React, {useEffect, useState, useCallback} from 'react';
import { Helmet } from 'react-helmet';
import logo from '../../assets/MainLogoWhite.png';
import portait from '../../assets/AboutMe/Portrait.jpeg';
import desk from '../../assets/AboutMe/Desk.jpeg';
import working from '../../assets/AboutMe/Working.jpeg';
import working2 from '../../assets/AboutMe/Working-2.jpeg';
import kayak from '../../assets/AboutMe/Kayak.jpeg';
import snow from '../../assets/AboutMe/Snow.jpeg';
import grad from '../../assets/AboutMe/Grad.jpg';
import banana from '../../assets/AboutMe/Banana.jpeg';
import { ImageSlideshow } from '../../components/ImageSlideshow/ImageSlideshow';
import { yearsSince } from '../../utils/timeUtils';
import {v4 as uuidv4} from 'uuid';
import { getPersonalInfo } from '../../api/firebaseApi';
import './About.scss';

// Define background change
const bodyStyle = `body { background-image: url('/public-images/about.jpg'); transition: all 1s ease-in-out;}`;

// Define screen sizes
const screens = {
    small: window.matchMedia("all and (max-device-width: 640px)").matches,
    tabletPort: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: portrait)").matches,
    tabletLand: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: landscape)").matches,
    medium: window.matchMedia("all and (min-device-width: 1025px) and (max-device-width: 1919px)").matches,
    large: window.matchMedia("all and (min-device-width: 1920px) and (max-device-width: 2559px)").matches,
    xlarge: window.matchMedia("all and (min-device-width: 2560px)").matches,
};

// Page to display info about the company
export function About(props) {
    // Get the component props
    const { sideBarOpen } = props;
    const [screenSize, setScreenSize] = useState(screens)
    const [slideWidth, setSlideWidth] = useState(650);
    const [slideHeight, setSlideHeight] = useState(400);
    const [slideWidthOpen, setSlideWidthOpen] = useState(550);
    const [slideHeightOpen, setSlideHeightOpen] = useState(300);
    const [myInfo, setMyInfo] = useState({});
    const [error, setError] = useState(false);

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

        const prev = {...screenSize}
        const prevKeys = Object.keys(prev);
        for (let i = 0; i < prevKeys.length; i++) {
            if (screenSizes[keys[i]] !== prev[prevKeys[i]]) {
                prev[prevKeys[i]] = screenSizes[keys[i]];
            }
        }
        setScreenSize(prev);
    }, [screenSize]);

    useEffect(() => {
        if (screenSize.small) {
            setSlideWidth(300);
            setSlideHeight(200);
            setSlideWidthOpen(300);
            setSlideHeightOpen(200);
        } else if (screenSize.tabletPort) {
            setSlideWidth(600);
            setSlideHeight(350);
            setSlideWidthOpen(500);
            setSlideHeightOpen(300);
        } else if (screenSize.tabletLand) {
            setSlideWidth(600);
            setSlideHeight(400);
            setSlideWidthOpen(500);
            setSlideHeightOpen(300);
        } else if (screenSize.large) {
            setSlideWidth(750);
            setSlideHeight(500);
            setSlideWidthOpen(650);
            setSlideHeightOpen(400);
        } else if (screenSize.xlarge) {
            setSlideWidth(1100);
            setSlideHeight(700);
            setSlideWidthOpen(1000);
            setSlideHeightOpen(600);
        } else {
            setSlideWidth(500);
            setSlideHeight(350);
            setSlideWidthOpen(450);
            setSlideHeightOpen(300);
        }
    }, [screenSize]);

    const fetchData = useCallback(async () => {
        const info = await getPersonalInfo();
        if (info[0]) {
            setMyInfo(info[1]);
            setError(false);
        } else {
            const payload = {
                id: uuidv4(),
                type: 'error',
                message: info[1],
            };
            alert(payload);
            setError(true);
        }
    }, []);

    useEffect(() => {
        if (!error && !myInfo.city) {
            fetchData();
        }
    }, [fetchData, myInfo, error])

    return (
        <section id="about-section" style={{width: sideBarOpen ? '83%' : '97%'}}>
            <Helmet>
                <title>Alex Bailey Resume | About Me</title>
                <style>{bodyStyle}</style>
            </Helmet>
            
            <div id="about-title-div" className="about-title">
                <div id="about-title-left">
                    <img src={logo} alt="logo.png" />
                </div>
                <div id="about-title-right">
                    <h1>About Me</h1>
                    <h3>Alex Bailey</h3>
                </div>
            </div>

            <div id="about-wrapper-div" className="about-wrapper-div">
                <div id="about-content" className="about-content">
                    <div className="about-content-split">
                        <div className={`split-left${sideBarOpen ? ' open' : ''}`}>
                            <img id="portait" src={portait} alt='Portait.jpeg' />
                        </div>
                        <div className="split-right">
                            <h1>WHO AM I?</h1>
                            <p>
                                My name is Alex Bailey and I'm currently {yearsSince('09/18/1999')} years old and I am currently living in {myInfo.city}, {myInfo.state}. I graduated from the College of Charleston in December of 2022 with a Bachelor's Degree in Computer Science. During my time studying Computer Science at the College of Charleston, I have acquired numerous different useful skills. I’ve discovered new ways of approaching difficult problems using algorithms. I’ve expanded my knowledge of programming languages and IDE’s. Some examples of languages I have learned are Java, JavaScript, Python, HTML, and PHP, just to name a few. I am well educated on the MVC (model-view-controller) Pattern as well as SQL queries and relational database concepts. I am also well versed in the Agile Scrum Development method. I am currently employed as a full time software developer for Booz Allen Hamilton.
                            </p>
                        </div>
                    </div>

                    <p>
                        In my capstone class, I became well practiced in the SCRUM Development Process. During this class, myself and three other teammates built a case management system for Soteria Digital Forensics. We used React as our front-end and PHP and SQL for our backend. During this project, I was able to apply my knowledge of PHP and SQL as well as learn the plethora of methods and functions contained within React. Since then, I have continued to expand my knowledge of React and JavaScript. 
                    </p>

                    <p>
                        Outside of computer programming, I have many different interests and hobbies that I enjoy. I have had a passion for music since I was very young. I have been actively performing in music for the past {yearsSince('08/01/2011')} years. I currently play the tuba, bass trombone, and bass guitar and I am well versed in both jazz, classical, and marching styles. I am a former member of the College of Charleston Orchestra and Wind Ensemble. Currently, I am a staff member for Chucktown Sound, CofC's official Athletic Band. 
                    </p>

                    <p>
                        I have also gained a lot of experience in leadership during both high school and college. I earned my Eagle Scout in the fall of 2018 and served in various leadership positions within BSA Troop 11 including Senior Patrol Leader, Patrol Leader, Webmaster, and Quartermaster. Additionally, I served as Tuba Section Leader in the Wando High School marching band in both 2016 and 2017. In order to qualify for this position, I attended numerous leadership seminars and conducted a leadership project. I continued to expand and improve my leadership skills in college by serving as Tuba Section Leader for Chucktown Sound. In June of 2022, I was also promoted to a Store Experience Leader (Manager) at YETI Charleston. 
                    </p>

                    <p>
                        <strong>
                            I have learned a great number of things in my {yearsSince('09/18/1999')} years of life. I continue to learn new skills and gain more experience everyday.
                        </strong>
                    </p>

                    <div className={`about-content-multiple${sideBarOpen ? ' open' : ''}`}>
                        <div>
                            <img id="working" src={working} alt='Working.jpeg' />
                        </div>
                        <div>
                            <img id="desk" src={desk} alt='Desk.jpeg' />
                        </div>
                        <div>
                            <img id="working-2" src={working2} alt='Working-2.jpeg' />
                        </div>
                    </div>

                    <hr />
                    <h1 id="story">MY STORY</h1>
                    <hr />

                    <div className="about-content-split">
                        <div className="split-left">
                            <p>
                                I was born just outside of the capital city of Phnom Penh, Cambodia. Well, at least I think I was. 
                                In Cambodia, most people do not record the exact date of their children’s birth. About three months 
                                after I was born, I was adopted from an orphanage in Phnom Penh by Janet and Tom Bailey. I was then 
                                made a US Citizen and given the first name Alexander. My original name, Moly (mole-ee), was made my middle 
                                name. My first home as a baby was in Virginia where I lived with my older brother and sister. My 
                                brother, who was also adopted from Cambodia, is 2 years older than me while my sister, who was not 
                                adopted, is 5 years older than me. From there, the Navy moved us to Hawaii, then to California, and 
                                lastly, Charleston, SC. I have been living in Charleston for the past {yearsSince('08/01/2007')} years.
                            </p>
                        </div>
                        <div className="split-right">
                            <ImageSlideshow 
                                path="About"
                                width={sideBarOpen ? slideWidthOpen : slideWidth}
                                height={sideBarOpen ? slideHeightOpen : slideHeight}
                                bullets
                                margin={screens.small ? '0' : '1em'}
                            />
                        </div>
                    </div>

                    <p>
                        In December of 2018, I had the incredible opportunity to travel to Cambodia to learn about my heritage as well as reunite with my birth family. We organized this trip with a company called <a href='https://www.adoptivefamilytravel.com/about-us'><font style={{fontStyle: 'italic'}}>Adoptive Family Travel </font></a>. We joined a few other families who had planned a heritage trip through the same agency. The trip was a total of two weeks and involved over 23 hours of flight (plus layovers), each way. 
                    </p>

                    <p>
                        Upon meeting my birth mother, I was able to gain some insight on why she gave me up and how I ended up at an orphanage in Phnom Penh. When my mom married my dad when she was 18, which is considered a normal age for marriage in Cambodia. Shortly thereafter, she became pregnant with me. Before I was born, my dad left, leaving my mom with no financial support and very little medical support. Following my birth, not only was she extremely poor, but she also was very sick and would often times pass out for extended periods of time. Of course, this made taking care of me very difficult. However, my mom was actually still willing raise me regardless of her health condition. She told me that she would not have ever let me go, even if things (somehow) got worse. But, my grandma saw things differently. She did not think that my mom would be able to provide a stable life for me, so she decided to take me from my mom and pass me to someone else, presumably to take care of me temporarily. 
                    </p>

                    <p>
                        The woman I was given to promised my mom that she would care for me until she got better. But instead, the woman gave me to an orphanage, so when my mom's health returned to normal, she could not find me or the woman I was given to. This lead her to believe that I was dead. About a year or so after losing me, my mom met my stepdad, a man from Vietnam, and fell in love with him. She married him, and had my two half-sisters and one half-brother. Despite the fact that her life moved on and she made a new family, she never forgot about me. She told me that she “missed me everyday”. So when she got a call from Adoptive Family Travel and was told that I was still alive, she simply broke down crying. When I arrived at her house and stepped out of the van to meet her, she immediately ran into my arms and began to cry.
                    </p>
                    <p>
                        A small part of me felt like I should be mad at my grandma for essentailly stealing me from my mom. But if she had not intervened, then I would not have become who I am today. Who's to say if I would have survived infancy at all? If she had decided to keep me, there is the possiblility that she still would have met my stepdad, who then would have helped raise me. However, in most Asian cultures, men do not (usually) take care of children from previous men. So, who knows. Ultimately, everything worked out perfectly for everyone in the end. After leaving Cambodia, I was able to stay connected to my mom and the entire family via Facebook Messenger. We continue to communicate regularly via translated text and video chat!
                    </p>

                    <div className="about-content-multiple">
                        <div>
                            <img id="kayak" src={kayak} alt='Desk.jpeg' />
                        </div>
                        <div>
                            <img id="snow" src={snow} alt='Working.jpeg' />
                        </div>
                        <div>
                            <img id="grad" src={grad} alt='Grad.jpg' />
                        </div>
                        <div>
                            <img id="banana" src={banana} alt='banana.jpeg' />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
