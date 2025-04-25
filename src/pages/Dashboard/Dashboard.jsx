import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { BsPlusCircle } from 'react-icons/bs';
import { RiDeleteBin2Line } from 'react-icons/ri';
import { TitleModal } from '../../components/Modals/TitleModal';
import { ListCard } from '../../components/Cards/ListCard';
import { v4 as uuidv4 } from 'uuid';
import { Helmet } from 'react-helmet';
// import pfp from '../../assets/image-placeholder.jpeg';
import './Dashboard.scss';

// Define background change
const bodyStyle = `body { background-image: url('/public-images/dash.jpg'); transition: all 1s ease-in-out;}`;

// Define alternate screen sizes
const screens = {
    small: window.matchMedia('all and (max-device-width: 640px)').matches,
    tablet: window.matchMedia('all and (min-device-width: 641px) and (max-device-width: 1024px)').matches,
};

// Page for Dashboard UI
export default function Dashboard(props) {
    // Get props and initalize state variables
    const { sideBarOpen, board, saveBoard, alert } = props;
    const [title, setTitle] = useState(board?.title);
    const [listData, setListData] = useState(board?.listData);
    const [showTitleModal, setShowTitleModal] = useState(false);

    // Function to handle changing the title of the board
    const titleModalHandler = (newTitle) => {
        setTitle(newTitle);
        setShowTitleModal(false);
    }

    // Function to handle updating the array of list cards
    const handleUpdateList = (updatedCard) => {
        setListData((prevList) => {
            return prevList.map((list) => {
                return list.id === updatedCard.id ? updatedCard : list;
            });
        });
    };    

    // Function to handle creating a new list of items
    const handleAddList = () => {
        const listDataLength = listData.length;
        if (listDataLength === 0) {
            const list = [{
                id: uuidv4(),
                order: 0,
                priority: 0,
                tags: [],
                title: 'New List',
                items: [],
            }]
            setListData(list);
        } else if (listDataLength > 0) {
            const previous = [...listData];
            const previousOrder = previous[listDataLength - 1].order;
            const newList = {
                id: uuidv4(),
                order: previousOrder + 1,
                priority: 0,
                tags: [],
                title: 'New List',
                items: [],
            }
            previous.push(newList);
            setListData(previous);
        }
    }

    // Function to wipe all data from the board
    const clearBoard = () => {
        setTitle('My Dashboard');
        setListData([]);
    }

    // Function to sort lists (non functional - outputs an error message)
    const alertHandler = () => {
        const alertPayload = {
            id: uuidv4(),
            type: 'error',
            message: 'All authentication functions are disabled.',
        };
        alert(alertPayload);
    }

    // useEffect to handle auto saving the board when changes are made
    useEffect(() => {
        if (board?.title !== title || board?.listData !== listData) {
            saveBoard({ title, listData });
        }
    }, [board, title, listData, saveBoard]);
    

    return (
        <section 
            id="dashboard-section" 
            style={ 
                !screens.small 
                ? { width: sideBarOpen ? '85%' : '97%' } 
                : {}
            }
        >
            <Helmet>
                <title>Alex Bailey Resume | Dashboard</title>
                <style>{bodyStyle}</style>
            </Helmet>
            <div id="dashboard-header-wrapper">
                {/* {(!screens.tablet && !screens.small) && (
                    <div id="profile-wrapper" className="profile-wrapper">
                            <img src={pfp} alt="task-master-logo.png" width="25px" />
                            {!!account.FirstName 
                                ? <div>
                                    <h1>{account.FirstName} {account.LastName}</h1>
                                    {account.Student && (
                                        <p>Student • {account.Instrument && account.Instrument[0]}</p>
                                    )}
                                    {account.Staff && (
                                        <p>Staff • {account.Instrument && account.Instrument[0]}</p>
                                    )}
                                </div>
                                : <h1>
                                    <Link to="/login">Login</Link>
                                    <span> / </span>
                                    <Link to="/create-account">Create</Link>
                                </h1>
                            }
                    </div>
                )} */}
                <div 
                    id="dashboard-title-wrapper" 
                    className="dashboard-title" 
                    // TODO: uncomment in dashboard story
                    // style={
                    //     !screens.small 
                    //     ? { width: sideBarOpen ? '41%' : '49%' } 
                    //     : {}
                    // }
                >
                    <div 
                        id="dashboard-title-button" 
                        className="title-button" 
                        onClick={() => setShowTitleModal(true)}
                    >
                        <h1>{title}</h1>
                    </div>
                </div>
                {!screens.small && (
                    <div id="dashboard-actions" className="dashboard-actions">
                        <button className="main-button" onClick={alertHandler}>
                            <BsPlusCircle /> Log Out
                        </button>
                        <button className="main-button" onClick={handleAddList}>
                            <BsPlusCircle /> Add List
                        </button>
                        <button className="main-button" onClick={clearBoard}>
                            <RiDeleteBin2Line /> Clear Board
                        </button>
                    </div>
                )}
            </div>
            {screens.small && (
                <div id="dashboard-actions" className="dashboard-actions">
                    <button className="main-button" onClick={alertHandler}>
                        <BsPlusCircle /> Send Test Alert
                    </button>
                    <button className="main-button" onClick={handleAddList}>
                        <BsPlusCircle /> Add List
                    </button>
                    <button className="main-button" onClick={clearBoard}>
                        <RiDeleteBin2Line /> Clear Board
                    </button>
                </div>
            )}
            <div id="dashboard-wrapper-div" className="dashboard-wrapper-div">
                <div id="dashboard-content" className="dashboard-content">
                    {listData?.map((list) => 
                        <ListCard 
                            key={`list-${list?.id}}`}
                            id={list?.id} 
                            order={list?.order}
                            priority={list?.priority}
                            tags={list?.tags}
                            title={list?.title} 
                            itemData={list?.items} 
                            updateCard={handleUpdateList} 
                        />
                    )}
                </div>
            </div>
            {showTitleModal && (
                <TitleModal title={title} setTitle={titleModalHandler} />
            )}
        </section>
    );
};
