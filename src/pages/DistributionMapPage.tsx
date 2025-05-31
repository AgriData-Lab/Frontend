import React, { useState } from 'react';
import RegionMap from '../components/map/RegionMap';
import Sidebar from '../components/common/SideBar.tsx';
import Header from '../components/common/Header.tsx';
import './MapPage.css';

const DistributionMapPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="mobile-container">
      <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="main-content">
        <div className="map-container">
          <RegionMap mapType="distribution" />
        </div>
      </main>
    </div>
  );
};

export default DistributionMapPage; 