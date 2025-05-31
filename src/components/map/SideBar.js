import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SideBar.css';

const SideBar = ({ isOpen, currentPage = 'default' }) => {
  const navigate = useNavigate();

  const handleNavigation = (page) => {
    switch(page) {
      case 'distribution':
        navigate('/map/distribution');
        break;
      case 'price':
        navigate('/map/price');
        break;
      default:
        navigate('/map');
        break;
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-content">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${currentPage === 'distribution' ? 'active' : ''}`}
            onClick={() => handleNavigation('distribution')}
          >
            유통시설 분포
          </button>
          <button 
            className={`filter-btn ${currentPage === 'price' ? 'active' : ''}`}
            onClick={() => handleNavigation('price')}
          >
            전국 시세 분포
          </button>
          <button 
            className={`filter-btn ${currentPage === 'default' ? 'active' : ''}`}
            onClick={() => handleNavigation('default')}
          >
            기본
          </button>
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
