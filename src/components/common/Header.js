import React from "react";
import './Header.css';

const Header = ({ toggleSidebar, isOpen }) => {
  return (
    <header className="header">
      <button className={`menu-button ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
};

export default Header;
