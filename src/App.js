import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import MapPage from "./pages/MapPage";
import DistributionMapPage from "./pages/DistributionMapPage";
import PriceMapPage from "./pages/PriceMapPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/map/distribution" element={<DistributionMapPage />} />
        <Route path="/map/price" element={<PriceMapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
