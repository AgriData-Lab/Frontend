import React from 'react';
import './SideBar.css';

const SideBar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <div className="filter-buttons">
          <button className="filter-btn active">유통시설 분포</button>
          <button className="filter-btn">전국 시세 분포</button>
          <button className="filter-btn">기본</button>
        </div>
        
        <div className="menu-items">
          <div className="menu-item">추가 메뉴 1</div>
          <div className="menu-item">추가 메뉴 2</div>
          <div className="menu-item">추가 메뉴 3</div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
