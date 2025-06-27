import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage.js';
import SignupPage from './pages/login/SignupPage.js';
import MapPage from './pages/map/MapPage.tsx';
import DistributionMapPage from './pages/map/DistributionMapPage.tsx';
import PriceMapPage from './pages/map/PriceMapPage.tsx';
import WholesalePricePage from './pages/wholesale_retail/Wholesale-price.tsx';
import RetailPricePage from './pages/wholesale_retail/Retail-price.tsx';
import FacilityMapPage from './pages/map/FacilityMapPage.tsx';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/distribution" element={<DistributionMapPage />} />
        <Route path="/map/price" element={<PriceMapPage />} />
        <Route path="/wholesale-price" element={<WholesalePricePage />} />
        <Route path="/retail-price" element={<RetailPricePage />} />
        <Route path="/map/facility" element={<FacilityMapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
