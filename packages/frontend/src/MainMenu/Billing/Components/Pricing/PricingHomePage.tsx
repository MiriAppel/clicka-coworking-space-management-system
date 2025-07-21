import React from 'react';
import { useNavigate } from 'react-router-dom';

const PricingHomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-xl mx-auto mt-10 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-8 text-center">ניהול תמחור</h1>
      <div className="flex flex-col gap-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded text-lg font-semibold shadow"
          onClick={() => navigate('/pricing/workspace')}
        >
          תמחור סביבת עבודה
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded text-lg font-semibold shadow"
          onClick={() => navigate('/pricing/meeting-room')}
        >
          תמחור חדרי ישיבות
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-4 rounded text-lg font-semibold shadow"
          onClick={() => navigate('/pricing/lounge')}
        >
          תמחור לאונג'
        </button>
      </div>
    </div>
  );
};

export default PricingHomePage;
