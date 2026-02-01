import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConsultantDataPage({ consultations = [] }) {
  const navigate = useNavigate();

  const handleClick = (consult) => {
    // Ensure consultation ID is properly formatted
    // Consultation IDs should be integers
    const formattedConsult = {
      ...consult,
      id: typeof consult.id === 'string' ? parseInt(consult.id, 10) : consult.id
    };
    
    // Navigate to ConsultantInfo page and pass the consultation data
    navigate('/ConsultantInfo', { state: formattedConsult });
  };

  const handleNewConsultation = () => {
    navigate("/StartTestPage");
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-13 md:mb-7 gap-3 py-3">
        <h1 className="text-[24px] font-bold">Consulenze</h1>
        <button 
          onClick={handleNewConsultation}
          className="bg-[#1E1E1E] text-white py-1.5 px-2 rounded-[2px] text-sm md:px-4 md:py-1 font-bold min-h-[34px] flex items-center max-w-[120px] md:max-w-none"
        >
          Nuova consulenza
        </button>
      </header>
      <div className="space-y-4">
        {consultations.map((consult) => (
          <div
            key={consult.id}
            className="border-b border-[#8F8F8F] pb-4 flex justify-between cursor-pointer"
            onClick={() => handleClick(consult)}
          >
            <div className="text-left">
              <div className="space-y-2">
                <p className="text-[16px] md:text-sm lg:text-base text-[#8F8F8F]">{consult.date}</p>
                <p className="text-[18px] md:text-base lg:text-lg font-medium leading-6 tracking-[0px] pb-2">{consult.title}</p>
              </div>
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 translate-y-[30px]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="#8F8F8F"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7"
                transform="rotate(180)"
                transform-origin="center"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}


