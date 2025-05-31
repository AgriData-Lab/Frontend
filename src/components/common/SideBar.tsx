import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const isActive = (path: string) => {
    // 정확한 경로 매칭을 위해 마지막 슬래시 제거
    const currentPath = location.pathname.replace(/\/$/, '');
    const targetPath = path.replace(/\/$/, '');
    return currentPath === targetPath;
  };

  const menuItems = [
    { path: '/map', label: '기본 지도' },
    { path: '/map/distribution', label: '유통 시설 분포' },
    { path: '/map/price', label: '전국 시세 분포' },
  ];

  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? 'visible' : ''}`} onClick={onClose} />
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="filter-buttons">
            {menuItems.map((item) => (
              <button
                key={item.path}
                className={`filter-btn ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 