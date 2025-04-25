import React from 'react';
import { Helmet } from 'react-helmet';
import logo from '../../assets/not-permitted.jpeg';
import './NoCreation.scss';

// Define background change
const bodyStyle = `body { background-image: url('/public-images/coming-soon.jpeg'); transition: all 1s ease-in-out; }`;

export function NoCreation(props) {
    const { sideBarOpen } = props;

    return (
        <section id="no-creation-section" style={{width: sideBarOpen ? '85%' : '97%'}}>
            <Helmet>
                <title>Alex Bailey Resume | Unavailable</title>
                <style>{bodyStyle}</style>
            </Helmet>
            <div id="no-creation-wrapper-div" className="no-creation-wrapper-div">
                <div id="no-creation-content" className="no-creation-content">
                    <div>
                        <img src={logo} alt='logo.png' />
                    </div>
                    <h1>Account Creation Unavailable!</h1>
                    <p>Sorry, creating a new account with this site is not permitted at this time.</p>
                    <p id="check-back">Check back later for more updates!</p>
                </div>
            </div>
        </section>
    );
};
