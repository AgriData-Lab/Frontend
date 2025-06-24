import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MapPage from './pages/MapPage';
import DistributionMapPage from './pages/DistributionMapPage';
import PriceMapPage from './pages/PriceMapPage';
import WholesalePricePage from './pages/Wholesale-price';
import RetailPricePage from './pages/Retail-price';

const App = () => {
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
      </Routes>
    </Router>
  );
};

export default App; 