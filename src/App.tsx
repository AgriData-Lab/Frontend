import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/login/SignupPage';
import MapPage from './pages/map/MapPage';
import PriceMapPage from './pages/map/PriceMapPage';
import WholesalePricePage from './pages/wholesale_retail/Wholesale-price';
import RetailPricePage from './pages/wholesale_retail/Retail-price';
import FacilityMapPage from './pages/map/FacilityMapPage';
import ResourceDirectory from "./pages/Agriguide";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/price" element={<PriceMapPage />} />
        <Route path="/wholesale-price" element={<WholesalePricePage />} />
        <Route path="/retail-price" element={<RetailPricePage />} />
        <Route path="/map/facility" element={<FacilityMapPage />} />
        <Route path="/links" element={<ResourceDirectory />} />
      </Routes>
    </Router>
  );
};

export default App; 