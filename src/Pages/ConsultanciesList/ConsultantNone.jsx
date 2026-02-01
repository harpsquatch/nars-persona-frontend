import React from 'react'
import ConsultantImg from "../../assets/IconConsultant.png";
import { Link } from "react-router-dom";

export default function ConsultantNone() {
  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Consultations</h1>
      </header>
      <div className="text-center text-gray-500 flex flex-col items-center mt-20 gap-20">
        <div className="w-55 h-24 mb-4">
          <img src={ConsultantImg} alt="" />
        </div>
        <div>
          <p className="max-w-[320px] mx-auto text-balance">
          No consultations have been<br />added yet
          </p>
          <Link to="/StartTestPage">
            <button className="mt-4 bg-[#1E1E1E] text-white py-2 px-4 rounded text-sm cursor-pointer font-bold">
              New consultation
            </button>
          </Link>
        </div>
      </div>    
    </div>
  )
}
