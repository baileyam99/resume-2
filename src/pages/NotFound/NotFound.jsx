import React from 'react';
import { Helmet } from 'react-helmet';
import image from '../../assets/404.png';
import './NotFound.scss';

// Define background change
const bodyStyle = `body { background-image: url('/public-images/not-found.jpeg'); transition: all 1s ease-in-out; }`;

export function NotFound(props) {
    const { sideBarOpen } = props;

    return (
        <section id="not-found-section" style={{width: sideBarOpen ? '85%' : '97%'}}>
            <Helmet>
                <title>Alex Bailey Resume | Page Not Found</title>
                <style>{bodyStyle}</style>
            </Helmet>
            <div id="not-fount-wrapper-div" className="not-found-wrapper-div">
                <div id="not-found-content" className="not-found-content">
                    <div>
                        <img src={image} alt='not-found.png' />
                    </div>
                    <h1>404: Page Not Found</h1>
                    <p>Sorry, we couldn't find the page you were looking for.</p>
                    <p id="check-back">Please check the URL and try again.</p>
                </div>
            </div>
        </section>
    );
};
