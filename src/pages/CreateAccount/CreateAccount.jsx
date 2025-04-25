import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { CreateAccountForm } from '../../components/Forms/CreateAccountForm.tsx'
import './CreateAccount.scss';

// Define background change
const bodyStyle = `
    body { 
        background-image: url('/public-images/create-account.jpeg'); 
        transition: background-image 1s ease-in-out; 
    }
`;


// Define screen sizes
const screens = {
    small: window.matchMedia("all and (max-device-width: 640px)").matches,
    tabletPort: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: portrait)").matches,
    tabletLand: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px) and (orientation: landscape)").matches,
    medium: window.matchMedia("all and (min-device-width: 1025px) and (max-device-width: 1919px)").matches,
    large: window.matchMedia("all and (min-device-width: 1920px) and (max-device-width: 2559px)").matches,
    xlarge: window.matchMedia("all and (min-device-width: 2560px)").matches,
};

export function CreateAccount(props) {
    const { sideBarOpen, alert } = props;
    const [screenSize, setScreenSize] = useState(screens);

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

    const alertHandler = (payload) => {
        alert(payload);
    };

    return (
        <section id="create-account-section" style={!screenSize.small ? {width: sideBarOpen ? '85%' : '97%'} : {}}>
            <Helmet>
                <title>Chucktown Sound | Create Account</title>
                <style>{bodyStyle}</style>
            </Helmet>
            <div id="create-account-wrapper-div" className="create-account-wrapper-div">
                <div id="create-account-content" className="create-account-content">
                    <CreateAccountForm alert={alertHandler} />
                </div>
            </div>
        </section>
    );
};
