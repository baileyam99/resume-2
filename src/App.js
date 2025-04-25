import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Dashboard from './pages/Dashboard/Dashboard';
import { IconContext } from 'react-icons/lib';
import { Sidebar, SidebarMobile } from './components/Sidebar/Sidebar';
import { About } from './pages/About/About';
import { Resume } from './pages/Resume/Resume';
import { JobDetails } from './pages/Resume/JobDetails';
import { AlertStack } from './components/Alerts/AlertStack';
import { Home } from './pages/Home/Home';
import { Contact } from './pages/Contact/Contact';
import { ComingSoon } from './pages/ComingSoon/ComingSoon';
import { NotFound } from './pages/NotFound/NotFound';
import { Login } from './pages/Login/Login';
import { Desktop } from './pages/Hardware/Desktop';
// import { CreateAccount } from './pages/CreateAccount/CreateAccount';
import { NoCreation } from './pages/NoCreation/NoCreation';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import './App.scss';
import { EducationDetails } from './pages/Resume/EducationDetails';

// Define alternate screen sizes
const screens = {
  small: window.matchMedia("all and (max-device-width: 640px)").matches,
  tablet: window.matchMedia("all and (min-device-width: 641px) and (max-device-width: 1024px)").matches,
};

// Main app
function App() {
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  // TODO: Uncomment this useState in dashboard story
  // const [accountData, setAccountData] = useState();
  const [user, setUser] = useState(undefined);

  // Function to handle opening alert messages
  const openAlertHandler = useCallback((newAlert) => {
    const alertList = [...alerts];
    if (newAlert instanceof Array) {
      for (let i = 0; i < newAlert.length; i++) {
        alertList.push(newAlert[i]);
      }
    } else {
      alertList.push(newAlert);
    }
    setAlerts(alertList);
  }, [alerts]);

  // Function to handle closing alert messages
  const closeAlertHandler = useCallback((id) => {
    const alertList = [...alerts];
    for (let i = 0; i < alertList.length; i++) {
        if (alertList[i].id === id) {
          alertList.splice(i, 1); 
        }
    }
    setAlerts(alertList);
  }, [alerts]);

  // Function to handle logged user change
  const userHandler = (newUser) => {
    setUser(newUser);
  };

  // TODO: Uncomment this useState in dashboard story
  // Function to handle account data change
  // const setAccountHandler = (data) => {
  //   setAccountData(data);
  // };

  return (
    <Router>
      <main>
        <IconContext.Provider value={{className: 'translator'}}>
          {
            screens.small 
            ? <SidebarMobile /> 
            : <Sidebar 
                isOpen={sideBarOpen} 
                // account={account}
                changeOpen={() => setSideBarOpen(!sideBarOpen)} 
              />
          }
          <Routes>
            <Route>
              {/* Home */}
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Home sideBarOpen={sideBarOpen} />} />

              <Route element={<PrivateRoute user={user} setUser={userHandler} sideBarOpen={sideBarOpen} />}>
                {/* Admin */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />  
                <Route 
                  path="/admin/dashboard" 
                  element={
                    // <Admin 
                    //   user={user}
                    //   account={accountData}
                    //   setAccount={setAccountHandler}
                    //   sideBarOpen={sideBarOpen} 
                    //   alert={openAlertHandler}
                    //   close={closeAlertHandler}
                    // />
                    <ComingSoon sideBarOpen={sideBarOpen} />
                  } 
                />
                <Route 
                  path="/admin/dashboard/:nav" 
                  element={
                    // TODO: Uncomment this code during Admin story
                    // <Admin 
                    //   user={user}
                    //   account={accountData}
                    //   setAccount={setAccountHandler}
                    //   sideBarOpen={sideBarOpen} 
                    //   alert={openAlertHandler}
                    //   close={closeAlertHandler}
                    // />
                    <ComingSoon sideBarOpen={sideBarOpen} />
                  } 
                />
                <Route 
                  path="/admin/dashboard/:nav/:action" 
                  element={
                    // TODO: Uncomment this code during Admin story
                    // <Admin 
                    //   user={user}
                    //   account={accountData}
                    //   setAccount={setAccountHandler}
                    //   sideBarOpen={sideBarOpen} 
                    //   alert={openAlertHandler}
                    //   close={closeAlertHandler}
                    // />
                    <ComingSoon sideBarOpen={sideBarOpen} />
                  } 
                />

                {/* Account */}
                <Route 
                  path="/dashboard/" 
                  element={
                    // TODO: Uncomment this code during Admin story
                    // <Dashboard 
                    //   user={user}
                    //   setUser={userHandler}
                    //   account={accountData}
                    //   setAccount={setAccountHandler}
                    //   sideBarOpen={sideBarOpen} 
                    //   alert={openAlertHandler}
                    //   close={closeAlertHandler}
                    // />
                    <ComingSoon sideBarOpen={sideBarOpen} />
                  }
                />
                <Route 
                  path="/dashboard/:nav" 
                  element={
                    // TODO: Uncomment this code during Admin story
                    // <Dashboard 
                    //   user={user}
                    //   setUser={userHandler}
                    //   account={accountData}
                    //   setAccount={setAccountHandler}
                    //   sideBarOpen={sideBarOpen} 
                    //   alert={openAlertHandler}
                    //   close={closeAlertHandler}
                    // />
                    <ComingSoon sideBarOpen={sideBarOpen} />
                  }
                />
              </Route>
              <Route path="/login" element={<Login sideBarOpen={sideBarOpen} alert={openAlertHandler} />} />
              <Route path="/create-account" element={<NoCreation sideBarOpen={sideBarOpen} />} />

              {/* Resume */}
              <Route path="/resume" element={<Resume sideBarOpen={sideBarOpen} alert={openAlertHandler} />} />
              <Route path="/resume/jobs/" element={<Navigate to="/resume" />} />
              <Route path="/resume/jobs/details" element={<JobDetails sideBarOpen={sideBarOpen} alert={openAlertHandler} />} />
              <Route path="/resume/education/" element={<Navigate to="/resume" />} />
              <Route path="/resume/education/details" element={<EducationDetails sideBarOpen={sideBarOpen} alert={openAlertHandler} />} />

              {/* About */}
              <Route path="/about" element={<About sideBarOpen={sideBarOpen} />} />

              {/* Projects */}
              <Route path="/projects" element={<ComingSoon sideBarOpen={sideBarOpen} />} />

              {/* Hardware */}
              <Route path="/hardware" element={<Navigate to="/home" />} />
              <Route path="/hardware/laptop" element={<ComingSoon sideBarOpen={sideBarOpen} />} />
              <Route path="/hardware/desktop" element={<Desktop sideBarOpen={sideBarOpen} alert={openAlertHandler} />} />

              {/* Contact */}
              <Route path="/contact" element={<Contact sideBarOpen={sideBarOpen} alert={openAlertHandler} />} />

              {/* Report */}
              <Route path="/report-a-problem-form" element={<h1>problem</h1>} />

              {/* Other */}
              <Route path="/access-denied" element={<h1>Access denied</h1>} />
              <Route path="/loading-screen" element={<h1>loading screen</h1>} />
              <Route path="*" element={<NotFound sideBarOpen={sideBarOpen} />} />
            </Route>
          </Routes>
          <AlertStack alerts={alerts} close={closeAlertHandler} />
        </IconContext.Provider>
      </main>
    </Router>
  );
};

export default App;
