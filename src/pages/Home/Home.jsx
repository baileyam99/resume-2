import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AiOutlineMail } from 'react-icons/ai';
import { SiInstagram, SiFacebook, SiTwitter} from "react-icons/si";
import { ImageSlideshow } from '../../components/ImageSlideshow/ImageSlideshow';
import logo from '../../assets/MainLogoWhite.png';
import { IconContext } from 'react-icons/lib';
import './Home.scss';

// Define page background
const bodyStyle = `body { background-image: url('/public-images/home.jpg'); transition: all 1s ease-in-out;}`;

// Define screen sizes
const screens = {
    small: window.matchMedia("all and (max-device-width: 640px)").matches,
    tabletPort: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: portrait)").matches,
    tabletLand: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: landscape)").matches,
    medium: window.matchMedia("all and (min-device-width: 1025px) and (max-device-width: 1919px)").matches,
    large: window.matchMedia("all and (min-device-width: 1920px) and (max-device-width: 2559px)").matches,
    xlarge: window.matchMedia("all and (min-device-width: 2560px)").matches,
};

export function Home(props) {
    // Get props and set state variables
    const { sideBarOpen } = props;
    const [showBullets, setShowBullets] = useState(true);
    const [screenSize, setScreenSize] = useState(screens);
    const [slideWidth, setSlideWidth] = useState(650);
    const [slideHeight, setSlideHeight] = useState(400);
    const [slideWidthOpen, setSlideWidthOpen] = useState(550);
    const [slideHeightOpen, setSlideHeightOpen] = useState(300);

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

    useEffect(() => {
        if (screenSize.small) {
            setSlideWidth(300);
            setSlideHeight(200);
            setSlideWidthOpen(300);
            setSlideHeightOpen(200);
            setShowBullets(false);
        } else if (screenSize.tabletPort) {
            setSlideWidth(600);
            setSlideHeight(350);
            setSlideWidthOpen(500);
            setSlideHeightOpen(300);
            setShowBullets(true);
        } else if (screenSize.tabletLand) {
            setSlideWidth(600);
            setSlideHeight(400);
            setSlideWidthOpen(500);
            setSlideHeightOpen(300);
            setShowBullets(true);
        } else if (screenSize.large) {
            setSlideWidth(750);
            setSlideHeight(500);
            setSlideWidthOpen(650);
            setSlideHeightOpen(400);
            setShowBullets(true);
        } else if (screenSize.xlarge) {
            setSlideWidth(1100);
            setSlideHeight(700);
            setSlideWidthOpen(1000);
            setSlideHeightOpen(600);
            setShowBullets(true);
        } else {
            setSlideWidth(650);
            setSlideHeight(400);
            setSlideWidthOpen(550);
            setSlideHeightOpen(300);
            setShowBullets(true);
        }
    }, [screenSize]);

    return (
        <section id="home-section" style={{width: sideBarOpen ? '85%' : '97%'}}>
            <Helmet>
                <title>Alex Bailey Resume | Home</title>
                <style>{bodyStyle}</style>
            </Helmet>

            <div id="home-wrapper-div" className="home-wrapper-div">
                <div id="home-content" className="home-content">
                    <div id="home-content-left">
                        <img src={logo} alt='logo.png' style={ sideBarOpen ? {width: 300} : {}} />
                        <h2>Welcome to</h2>
                        <h1 className={sideBarOpen ? 'open-left' : ''}>Alex Bailey's Resume Site</h1>
                        {!screenSize.tabletPort && (
                            <>
                                <Link to="/resume">
                                    <button className="main-button">Resume</button>
                                </Link>
                                <Link to="/about">
                                    <button className="main-button">About Me</button>
                                </Link>   
                            </>
                        )}
                    </div>
                    <div id="home-content-right" className={sideBarOpen ? 'open' : ''}>
                        <ImageSlideshow 
                            path={'Home'} 
                            width={sideBarOpen ? slideWidthOpen : slideWidth}
                            height={sideBarOpen ? slideHeightOpen : slideHeight}
                            margin={sideBarOpen ? undefined : screenSize.small ? '0 auto' : '1.5em auto'}
                            bullets={showBullets}
                            showNavs
                        />
                        <Link to="/contact">
                            <button className="main-button">Contact Me</button>
                        </Link>
                        {screenSize.tabletPort && (
                            <>
                                <Link to="/resume">
                                    <button className="main-button">Resume</button>
                                </Link>
                                <Link to="/about-me">
                                    <button className="main-button">About Me</button>
                                </Link>
                            </>
                        )}
                        <IconContext.Provider value={{className: 'link-icons'}}>
                            <h2>
                                <a href="https://www.instagram.com/bailey_alex99" target="_blank" rel="noreferrer">
                                    <SiInstagram />
                                </a> &nbsp;
                                <a href="https://www.facebook.com/bailey.alex99" target="_blank" rel="noreferrer">
                                    <SiFacebook />
                                </a> &nbsp;
                                <a href="https://x.com/bailey_alex99" target="_blank" rel="noreferrer">
                                    <SiTwitter />
                                </a> &nbsp;
                                <Link to="/contact">
                                    <AiOutlineMail />
                                </Link>
                            </h2>
                        </IconContext.Provider>
                    </div>
                </div>
            </div>
        </section>
    )
}
