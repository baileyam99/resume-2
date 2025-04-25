import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MobileSubMenu.scss';
import { IconContext } from 'react-icons';

// Component for mobile sidebar
const SubMenu = ({ item }) => {

  // Initialize subnav state
  const [subnav, setSubnav] = useState(false);

  // Negate subnav state
  const showSubnav = () => setSubnav(!subnav);

  return (
    <>
      <Link className="styled-link" to={item.path} onClick={item.subNav && showSubnav}>
        <div className="label-div">
          {item.icon}
          <span>{item.title}</span>
        </div>
        <div>
          {item.subNav && subnav
            ? item.iconOpened
            : item.subNav
            ? item.iconClosed
            : null
          }
        </div>
      </Link>
      <IconContext.Provider value={{className: "icons"}}>
        {subnav &&
          item.subNav.map((item, index) => {
            return (
              <Link className="dropdown-link" to={item.path} key={index}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            );
        })}
      </IconContext.Provider>
    </>
  );
};

// Export Sub Menu
export default SubMenu;
