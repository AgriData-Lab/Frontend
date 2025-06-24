import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MapPage from './pages/MapPage.tsx';
import DistributionMapPage from './pages/DistributionMapPage.tsx';
import PriceMapPage from './pages/PriceMapPage.tsx';
import WholesalePricePage from './pages/Wholesale-price.tsx';
import RetailPricePage from './pages/Retail-price.tsx';

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
      </Routes>
    </Router>
  );
}

export default App;
