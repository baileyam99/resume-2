import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import './Hardware.scss';

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

export const Laptop = (props) => {
    // Get props and set state variables
    const { sideBarOpen, alert } = props;
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
        <section id="laptop-section" style={{width: sideBarOpen ? '85%' : '97%'}}>
            <Helmet>
                <title>Alex Bailey Resume | Laptop</title>
                <style>{bodyStyle}</style>
            </Helmet>
            <div id="laptop-wrapper-div" className="hardware-wrapper-div">
                <div id="laptop-content" className="hardware-content">
                    
                </div>
            </div>
        </section>
    );
}
