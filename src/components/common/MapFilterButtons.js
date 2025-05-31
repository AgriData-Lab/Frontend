// components/map/MapFilterButtons.tsx
import React from "react";

const MapFilterButtons = () => {
  return (
    <div className="space-y-2">
      <button className="bg-white text-red-500 border border-red-300 rounded-full px-3 py-1 text-sm font-bold shadow">
        유통시설 분포
      </button>
      <button className="bg-white text-pink-700 border border-pink-300 rounded-full px-3 py-1 text-sm font-bold shadow">
        전국 시세 분포
      </button>
      <button className="bg-white text-gray-800 border border-gray-300 rounded-full px-3 py-1 text-sm font-bold shadow">
        기본
      </button>
    </div>
  );
};

export default MapFilterButtons;