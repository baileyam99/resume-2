import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { getJobByUuid, getJobImagesUuid } from '../../api/firebaseApi';
import { v4 as uuidv4 } from 'uuid';
import { NotFound } from '../NotFound/NotFound';
import { Loading } from '../../components/LoadingScreen/Loading';
import { useNavigate } from 'react-router-dom';
import Markdown from 'markdown-to-jsx'
import './JobDetails.scss';


// Define background change
const bodyStyle = `body { background-image: url('/public-images/resume.jpeg'); background-position: bottom; transition: all 1s ease-in-out;}`;

export function JobDetails(props) {
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
            const res = await getJobByUuid(uuid);
            const imagesRes = await getJobImagesUuid(uuid);
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
            <section id="job-details-section" style={{width: sideBarOpen ? '84%' : '97%'}}>
                <Helmet>
                    <title>Alex Bailey Resume | {`${data.title}`}</title>
                    <style>{bodyStyle}</style>
                </Helmet>

                <div id="job-details-title-div" className="job-details-title">
                    {images.length > 0 && <img src={images[0]} alt="title-pic" />}
                    {data && (
                        <>
                            <h1>{data.title}</h1>
                            <h3>{data.company}</h3>
                        </>
                    )}
                </div>

                <div id="job-details-wrapper-div" className="job-details-wrapper-div">
                    <div id="job-details-content" className="job-details-content">
                        <div className="data-div row">
                            <div>
                                <div id="job-description">
                                    <h2 className='desc'>Job Description</h2>
                                    {data.description && <p>{data.description}</p>}
                                    {!data.description && <p>No description found.</p>}
                                </div>
                                {images.length >= 2 && <img src={images[1]} alt="description-pic" />}
                            </div>
                        </div>

                        <div className="list-wrapper">
                            {images.length >= 3 && <img src={images[2]} alt="responsibilities-pic" />}
                            <h2 id="resp-title">Responsibilites</h2>
                            <p>Duties and Responsibilites include the following:</p>
                            {data && (
                                <ul>
                                    {(data.responsibilities && data.responsibilities) && 
                                        (data.responsibilities.map((task) => <li>{task}</li>))
                                    }
                                    {(!data.responsibilities || data.responsibilities.length === 0) && <li>No responsibilities found.</li>}
                                </ul>
                            )}
                        </div>

                        <div className="data-div">
                            {data && (
                                <div>
                                    <h2>{data.company}</h2>
                                    <Markdown>{data.companyHistory}</Markdown>
                                </div>
                            )}
                        </div>

                        <div id="experiences" className="data-div">
                            {data && (
                                <>
                                    <div id="experience-info">
                                        <h2>Experiences</h2>
                                        {data.experiences && <Markdown>{data.experiences}</Markdown>}
                                        {!data.experiences && <p>No experiences found.</p>}
                                    </div>
                                    <div id="experience-info-images">
                                        {images.length >= 4 && <img src={images[3]} alt="experiences-pic" />}
                                        {images.length >= 5 && <img src={images[4]} alt="experiences-pic-2" />}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="image-link-div">
                            <h3>
                                Images courtesy of <a href={data.imageLink} target="_blank" rel="noreferrer">{data.company.split(' ')[0]}</a>
                            </h3>
                        </div>

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
