import React, { useEffect, useState, useCallback } from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';
import { MdClose, MdErrorOutline } from 'react-icons/md';
import { IoWarningOutline } from 'react-icons/io5';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IconContext } from 'react-icons/lib';
import './Alert.scss';

// Alert component
export function Alert(props) {
    // Get props and initalize state variables
    const { id, type, message, close } = props;
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [warn, setWarn] = useState(false);
    const [info, setInfo] = useState(false);

    // Function to handle closing the alert message
    const closeHandler = useCallback(() => {
        close(id);
    }, [close, id]);

    // useEffect to determine the type of alert message and timeout handler
    useEffect(() => {
        if (type === 'success') {
            setSuccess(true);
        } else if (type === 'error') {
            setError(true);
        } else if (type === 'warn') {
            setWarn(true);
        } else if (type === 'info') {
            setInfo(true);
        }

        const timeout = setTimeout(() => {
            closeHandler();
        }, 5000);

        return () => clearTimeout(timeout);
    }, [type, closeHandler]);

    return (
        <>
            <div id={`alert-${id}`} className={`alert ${type}`}>
                <IconContext.Provider value={{className: 'alert-icons'}}>
                    {success && <h2><FaRegCheckCircle /> Success!</h2>}
                    {error && <h2><MdErrorOutline /> Error!</h2>}
                    {warn && <h2><IoWarningOutline /> Warning!</h2>}
                    {info && <h2><AiOutlineInfoCircle /> Info</h2>}
                    <div id={`close-alert-${id}`} className="alert-close" onClick={closeHandler}>
                        <MdClose />
                    </div>
                    <p id={`alert-message-${id}`}>{message}</p>
                </IconContext.Provider>
            </div>
        </>
    );
};
