import React from 'react';
import './Header.css';

interface HeaderProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

const Header = ({ toggleSidebar, isOpen }: HeaderProps) => {
  return (
    <header className="header">
      <button
        onClick={toggleSidebar}
        className={`menu-button ${isOpen ? 'open' : ''}`}
      >
        <span />
        <span />
        <span />
      </button>
      <h1>지도</h1>
    </header>
  );
};

export default Header; 