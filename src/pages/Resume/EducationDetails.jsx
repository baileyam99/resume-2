import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { getEducationByUuid, getEducationImagesUuid } from '../../api/firebaseApi';
import { v4 as uuidv4 } from 'uuid';
import { NotFound } from '../NotFound/NotFound';
import { Loading } from '../../components/LoadingScreen/Loading';
import { useNavigate } from 'react-router-dom';
import Markdown from 'markdown-to-jsx'
import './EducationDetails.scss';


// Define background change
const bodyStyle = `body { background-image: url('/public-images/resume.jpeg'); background-position: bottom; transition: all 1s ease-in-out;}`;

export function EducationDetails(props) {
    // Get props and initalize state variables
    const { sideBarOpen, alert } = props;
    const queryString = window.location.search; 
    const urlParams = new URLSearchParams(queryString);
    const uuid = urlParams.get('uuid');
    const navigate = useNavigate();
    const [data, setData] = useState();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const alertHandler = useCallback((payload) => {
        alert(payload);
    }, [alert]);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const alertMessages = [];
            const res = await getEducationByUuid(uuid);
            const imagesRes = await getEducationImagesUuid(uuid);
            if (res[0]) {
                if (res[1]) {
                    setData(res[1]);
                } else {
                    setData('none')
                }
            } else {
                const payload = {
                    id: uuidv4(),
                    type: 'error',
                    message: res[1],
                }
                setIsError(true);
                alertMessages.push(payload);
            }

            if (imagesRes[0]) {
                if (imagesRes[1]) {
                    setImages(imagesRes[1]);
                } else {
                    setImages([]);
                }
            } else {
                const payload = {
                    id: uuidv4(),
                    type: 'error',
                    message: imagesRes[1],
                }
                setIsError(true);
                alertMessages.push(payload);
            }

            if (!isError && alertMessages.length > 0) {
                alertHandler(alertMessages);
            }
            setLoading(false);
        };
        if (uuid) {
            fetch();
        }
    }, [uuid, isError, alertHandler]);

    const handleBackButtonClick = () => {
        navigate('/resume/');
    };

    const handleHomeButtonClick = () => {
        navigate('/home/');
    };

    if (!loading && typeof data === 'object') {
        return (
            <section id="education-details-section" style={{width: sideBarOpen ? '84%' : '97%'}}>
                <Helmet>
                    <title>Alex Bailey Resume | {`${data.institution}`}</title>
                    <style>{bodyStyle}</style>
                </Helmet>

                <div id="education-details-title-div" className="education-details-title">
                    {images.length > 0 && <img src={images[0]} alt="title-pic" />}
                    {data && (
                        <>
                            <h1>{data.institution}</h1>
                            <h3>{data.city}, {data.state}</h3>
                        </>
                    )}
                </div>

                <div id="education-details-wrapper-div" className="education-details-wrapper-div">
                    <div id="education-details-content" className="education-details-content">
                        <h2 className="info-title">Education General Info</h2>
                        <div className="content-split full">
                            <div className="left">
                                <p>Degree Type:</p>
                                <p>Major:</p>
                                <p>Graduation Status:</p>
                                <p>Graduation Year:</p>
                            </div>
                            <div className="right">
                                <p>{data.type ? data.type : '-'}</p>
                                <p>{data.major ? data.major : 'N/A'}</p>
                                <p>{data.status ? 'Completed' : 'In Progress'}</p>
                                <p>{data.graduation ? data.graduation : '-'}</p>
                            </div>
                        </div>

                        <div className="data-div">
                            <div>
                                <h2>Institution History</h2>
                                {(data.institutionHistory && data.institutionHistory.length > 0) && (
                                    <>
                                        {data.institutionHistory.map(paragraph => <Markdown key={uuidv4()}>{paragraph}</Markdown>)}
                                    </>
                                )}
                                {(!data.institutionHistory || data.institutionHistory.length === 0) && <p>No data found.</p>}
                            </div>
                        </div>

                        <div className="data-div row">
                            {images.length >= 2 && <img src={images[1]} alt="history-pic-1" />}
                            {images.length >= 3 && <img src={images[2]} alt="history-pic-2" />}
                        </div>

                        {(data.experiences && data.experiences.length > 0) && (
                            <>
                                <h2 className='exp'>Experiences</h2>
                                {data.experiences.map((paragraph, i) => {
                                    const odd = i % 2;
                                    if (odd && images.length >= i + 3) {
                                        return (
                                            <div className="content-split">
                                                <div key={uuidv4()} className="left">
                                                    <Markdown>{paragraph}</Markdown>
                                                </div>
                                                <div className="right">
                                                    {images.length >= i + 3 && (
                                                        <img src={images[i + 2]} alt={`experiences-pic-${i}`} />
                                                    )}
                                                    {images.length >= i + 4 && (
                                                        <img src={images[i + 3]} alt={`experiences-pic-${i}`} />
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    }
                                    return (
                                        <div key={uuidv4()} className="content-split">
                                            <Markdown>{paragraph}</Markdown>
                                        </div>
                                    )
                                })}
                            </>
                        )}
                        {(!data.experiences || data.experiences.length === 0) && <p>No experiences found.</p>}

                        {data.imageLink && (
                            <div className="image-link-div">
                                <h3>
                                    Images courtesy of <a href={data.imageLink} target="_blank" rel="noreferrer">{data.institution}</a>
                                </h3>
                            </div>
                        )}

                        <div id="action-button-div">
                            <button className="main-button" onClick={handleBackButtonClick}>Back</button>
                            <button className="main-button" onClick={handleHomeButtonClick}>Home</button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!loading && typeof data === 'string') { 
        return <NotFound sideBarOpen={sideBarOpen} />;
    }

    return (
        <Loading sideBarOpen={sideBarOpen} />
    );
};
