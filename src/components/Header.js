import React from "react";
import './Header.css';

const Header = ({ toggleSidebar }) => {
  return (
    <header className="header">
      <button className="menu-button" onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
};

export default Header;
