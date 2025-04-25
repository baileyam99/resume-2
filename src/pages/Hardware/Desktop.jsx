import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { ImageSlideshow } from '../../components/ImageSlideshow/ImageSlideshow';
import logo from '../../assets/desktop.jpeg';
import Oval from 'react-loading-icons/dist/esm/components/oval';
import { getHardwareImages } from '../../api/firebaseApi';
import { v4 as uuidv4 } from 'uuid';
import './Hardware.scss';

// Define page background
const bodyStyle = `body { background-image: url('/public-images/desktop.jpeg'); transition: all 1s ease-in-out;}`;

// Define screen sizes
const screens = {
    small: window.matchMedia("all and (max-device-width: 640px)").matches,
    tabletPort: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: portrait)").matches,
    tabletLand: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: landscape)").matches,
    medium: window.matchMedia("all and (min-device-width: 1025px) and (max-device-width: 1919px)").matches,
    large: window.matchMedia("all and (min-device-width: 1920px) and (max-device-width: 2559px)").matches,
    xlarge: window.matchMedia("all and (min-device-width: 2560px)").matches,
};

export const Desktop = (props) => {
    // Get props and set state variables
    const { sideBarOpen, alert } = props;
    const [showBullets, setShowBullets] = useState(true);
    const [screenSize, setScreenSize] = useState(screens);
    const [slideWidth, setSlideWidth] = useState(650);
    const [slideHeight, setSlideHeight] = useState(400);
    const [slideWidthOpen, setSlideWidthOpen] = useState(550);
    const [slideHeightOpen, setSlideHeightOpen] = useState(300);
    const [loading, setLoading] = useState(false);
    const [currentImageUrls, setCurrentImageUrls] = useState();
    const [originalImageUrls, setOriginalImageUrls] = useState();

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
            setSlideWidth(550);
            setSlideHeight(350);
            setSlideWidthOpen(500);
            setSlideHeightOpen(300);
            setShowBullets(true);
        }
    }, [screenSize]);

    const alertHandler = useCallback((payload) => {
        alert(payload);
    }, [alert]);

    const fetch = useCallback(async () => {
        setLoading(true);
        const currentImageRes = await getHardwareImages('desktop/current/');
        const originalImageRes = await getHardwareImages('desktop/original/');

        const alertList = [];

        if (currentImageRes[0]) {
            setCurrentImageUrls(currentImageRes[1]);
        } else {
            alertList.push({
                id: uuidv4(),
                type: 'error',
                message: currentImageRes[1],
            });
        }

        if (originalImageRes[0]) {
            setOriginalImageUrls(originalImageRes[1]);
        } else {
            alertList.push({
                id: uuidv4(),
                type: 'error',
                message: originalImageRes[1],
            });
        }

        if (alertList.length > 0) {
            alertHandler(alertList);
        }

        setLoading(false);
    }, [alertHandler]);

    useEffect(() => {
        if (!currentImageUrls && !originalImageUrls) {
            fetch();
        }
    }, [currentImageUrls, originalImageUrls, fetch]);

    return (
        <section id="desktop-section" style={{width: sideBarOpen ? '85%' : '97%'}}>
            <Helmet>
                <title>Alex Bailey Resume | Desktop</title>
                <style>{bodyStyle}</style>
            </Helmet>

            <div id="desktop-title-div" className="hardware-title">
                <div id="desktop-title-left" style={sideBarOpen ? {width: '35%'} : {}}>
                    <img src={logo} alt="logo.png" />
                </div>
                <div id="desktop-title-right">
                    <h1>Desktop</h1>
                    <h3>Custom Built Gaming PC</h3>
                </div>
            </div>

            <div id="desktop-wrapper-div" className="hardware-wrapper-div">
                <div id="desktop-content" className="hardware-content">
                    {loading && <Oval />}

                    {!loading && (
                        <>
                            <div className="hardware-content-split">
                                <div id="desktop-machine">
                                    <h1>Desktop Machine</h1>
                                    <h3>Windows PC</h3>
                                </div>
                                <p>
                                    This desktop, Windows machine was custom built by me in May 2020. It is the first machine that I have built by myself. I selected interal parts optimized for gaming as well as RGB components for aesthetics. The current part specification list is as follows:
                                </p>
                                <div className={`split-left${sideBarOpen ? ' open' : ''}`}>
                                    <div>
                                        <ul>
                                            <li>
                                                <strong>Processor:</strong> AMD Ryzen 7 3800X 8-Core Processor (3.89 GHz)
                                            </li>
                                            <li>
                                                <strong>RAM:</strong> Corsair Vengeance LPX 32GB (4 X 8GB) DDR4-3600
                                            </li>
                                            <li>
                                                <strong>Motherboard:</strong> Gigabyte X570 AORUS PRO WIFI ATX AM4 Motherboard
                                            </li>
                                            <li>
                                                <strong>CPU Cooler:</strong> Corsair H115i RGB PLATINUM 97 CFM Liquid CPU Cooler
                                            </li>
                                            <li>
                                                <details>
                                                    <summary>Storage:</summary>
                                                    <ul>
                                                        <li>Crucial MX500 500 GB 2.5" Solid State Drive</li>
                                                        <li>Intel 665p Series M.2 2280 1TB PCIe NVMe 3.0 Solid State Drive</li>
                                                        <li>Seagate Barracuda Compute 2TB 3.5" 7200 RPM Internal Hard Drive</li>
                                                        <li>Toshiba X300 4TB Performance & Gaming 3.5-Inch Internal Hard Drive</li>
                                                    </ul>
                                                </details>
                                            </li>
                                            <li>
                                                <strong>Video Card:</strong> EVGA XC Gaming Nvidia GeForce RTX 2070 8GB GDDR6 Video Card
                                            </li>
                                            <li>
                                                <strong>PSU:</strong> ASUS ROG Strix 750 Fully Modular 80 Plus Gold 750W ATX Power Supply
                                            </li>
                                            <li>
                                                <strong>Case:</strong> Corsair 5000D Airflow Tempered Glass Mid-Tower ATX Case
                                            </li>
                                            <li>
                                                <details>
                                                    <summary>Monitors:</summary>
                                                    <ul>
                                                        <li>
                                                            Dell S2716DG LED with G-Sync 27" Gaming Computer Monitor (2560 x 1440 | 1ms Response Time | 144 Hz Refresh Rate)
                                                        </li>
                                                        <li>
                                                            Acer SB220Q bi 21.5 Inches Full HD IPS Ultra-Thin Zero Frame Monitor (1920 x 1080 | 4ms Response Time | 75 Hz Refresh Rate)
                                                        </li>
                                                    </ul>
                                                </details>
                                            </li>
                                            <li>
                                                <details>
                                                    <summary>Peripherals</summary>
                                                    <ul>
                                                        <li>
                                                            <strike>Tecware Phantom 104 RGB Wired Gaming Keyboard</strike> *Sold June 2024
                                                        </li>
                                                        <li>AJAZZ AK35I V3 Full Size Mechanical Gaming Keyboard</li>
                                                        <li>Razer Deathadder V2 Wired Optical Gaming Mouse</li>
                                                        <li>HP External Portable Slim Design CD/DVD RW Write/Read Drive</li>
                                                        <li>Kingwin USB HUB Adapter w/ Memory Card Reader Writer & USB 3.0 HUB Combo</li>
                                                        <li>Techole HDMI Switch 4K HDMI Splitter</li>
                                                        <li>Western Digital 8TB My Book Desktop External Hard Drive</li>
                                                        <li>Logitech Z200 Stereo Speakers</li>
                                                    </ul>
                                                </details>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="split-right">
                                    <ImageSlideshow 
                                        path="Desktop"
                                        urls={!currentImageUrls ? [] : currentImageUrls}
                                        width={sideBarOpen ? slideWidthOpen : slideWidth}
                                        height={sideBarOpen ? slideHeightOpen : slideHeight}
                                        bullets={showBullets}
                                        margin={screens.small ? '0' : '1em'}
                                    />
                                </div>
                            </div>

                            <div className="hardware-content-split">
                                <div><h1>Original Version</h1></div>
                                <p>
                                    The original configuration of this machine was slightly different from what it is now. I have swapped out as well as added various components to improve the performance and aesthetics of my machine. The components that existed in the original configuration are as follows:
                                </p>

                                <div className={`split-left${sideBarOpen ? ' open' : ''}`}>
                                    <ImageSlideshow 
                                        path="Desktop-orig"
                                        urls={!originalImageUrls ? [] : originalImageUrls}
                                        width={sideBarOpen ? slideWidthOpen : slideWidth}
                                        height={sideBarOpen ? slideHeightOpen : slideHeight}
                                        bullets={showBullets}
                                        margin={screens.small ? '0' : '1em'}
                                    />
                                </div>

                                <div className="split-right">
                                    <div>
                                        <ul>
                                            <li>
                                                <strong>RAM:</strong> Teamgroup T-Force Delta RGB 16GB (2 X 8GB) DDR4-3000
                                            </li>
                                            <li>
                                                <details>
                                                    <summary>Storage:</summary>
                                                    <ul>
                                                        <li>Crucial MX500 500 GB 2.5" Solid State Drive</li>
                                                        <li>Seagate Barracuda Compute 2TB 3.5" 7200 RPM Internal Hard Drive</li>
                                                    </ul>
                                                </details>
                                            </li>
                                            <li>
                                                <strong>PSU:</strong> ASUS ROG Strix 550 Fully Modular 80 Plus Gold 550W ATX Power Supply
                                            </li>
                                            <li>
                                                <strong>Case:</strong> Fractal Design Meshify C ATX Mid Tower Case
                                            </li>
                                            <li>
                                                <strong>Monitor:</strong> Acer SB220Q bi 21.5 Inches Full HD IPS Ultra-Thin Zero Frame Monitor (1920 x 1080 | 4ms Response Time | 75 Hz Refresh Rate)
                                            </li>
                                            <li>
                                                <details>
                                                    <summary>Peripherals:</summary>
                                                    <ul>
                                                        <li>Tecware Phantom 104 RGB Wired Gaming Keyboard</li>
                                                        <li>Old Wired Optical Mouse (found in parents' house)</li>
                                                        <li>HP External Portable Slim Design CD/DVD RW Write/Read Drive</li>
                                                        <li>Logitech Z200 Stereo Speakers</li>
                                                    </ul>
                                                </details>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <p>
                                    All other components of the system are the same as the previous list. This system is a ongoing project that has seen multiple variations. For example, the system originally had a 550W PSU, but after using the machine for about two weeks, it became evident that I needed more power. I then swapped the 550W PSU for a 750W PSU. Additionally, for a while I only had one monitor, but added a second in December of 2020. The system was otherwise the same until about May of 2021, when I swapped the Fractal Design case with the Corsair case, and so on and so forth. The original machine and added accessories cost me in total abut $2000.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
