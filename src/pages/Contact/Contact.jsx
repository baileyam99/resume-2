import React from 'react';
import { ContactForm } from '../../components/Forms/ContactFrom.tsx';
import { Helmet } from 'react-helmet';
import './Contact.scss';

// Define background change
const bodyStyle = `
    body { 
        background-image: url('/public-images/contact.jpg'); 
        background-position: bottom; 
        transition: all 1s ease-in-out;
    }
`;

// Page to display contact info
export function Contact(props) {
    // Get the component props
    const { sideBarOpen, alert } = props;

    // Function to show message
    const handleAlert = (payload) => {
        alert(payload);
    }

    return (
        <section id="contact-section" style={{width: sideBarOpen ? '83%' : '97%'}}>
            <Helmet>
                <title>Alex Bailey Resume | Contact Me</title>
                <style>{bodyStyle}</style>
            </Helmet>
            <div id="contact-title-div" className="contact-title">
                <h1>Want to get in contact with me?</h1>
                <h3>Submit a message here!</h3>
            </div>
            <div id="contact-wrapper-div" className="contact-wrapper-div">
                <div id="contact-content" className="contact-content">
                    <ContactForm alert={handleAlert} />
                </div>
            </div>
        </section>
    );
};
