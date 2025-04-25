import React from 'react';
import { Helmet } from 'react-helmet';
import logo from '../../assets/UnderConstruction.jpeg';
import './ComingSoon.scss';

// Define background change
const bodyStyle = `body { background-image: url('/public-images/coming-soon.jpeg'); transition: all 1s ease-in-out; }`;

export function ComingSoon(props) {
    const { sideBarOpen } = props;

    return (
        <section id="coming-soon-section" style={{width: sideBarOpen ? '85%' : '97%'}}>
            <Helmet>
                <title>Alex Bailey Resume | Coming Soon</title>
                <style>{bodyStyle}</style>
            </Helmet>
            <div id="coming-soon-wrapper-div" className="coming-soon-wrapper-div">
                <div id="coming-soon-content" className="coming-soon-content">
                    <div>
                        <img src={logo} alt='logo.png' />
                    </div>
                    <h1>Coming Soon!</h1>
                    <p>Sorry, this page is still under construction.</p>
                    <p id="check-back">Check back soon for more updates!</p>
                </div>
            </div>
        </section>
    );
};
