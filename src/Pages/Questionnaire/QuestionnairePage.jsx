import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Grid } from "../../Components/Grid";
import { API_BASE_URL } from "../../services/api";

const questions = [
  {
    id: 1,
    text: "Questa frase ti rappresenta?",
    statement: "Penso di valere almeno quanto le altre persone",
    options: [
      "Decisamente sì!",
      "Sì, direi di sì.",
      "Mah, non saprei.",
      "Non sono d'accordo.",
      "Per nulla!",
    ],
  },
  {
    id: 2,
    text: "Questa frase ti rappresenta?",
    statement: "Quando non indosso il make-up, mi sento meno attraente o meno a mio agio con il mio aspetto",
    options: [
      "Decisamente sì!",
      "Sì, direi di sì.",
      "Mah, non saprei.",
      "Non sono d'accordo.",
      "Per nulla!",
    ],
  },
  {
    id: 3,
    text: "Questa frase ti rappresenta?",
    statement: "Mi apprezzo per come sono",
    options: [
      "Decisamente sì!",
      "Sì, direi di sì.",
      "Mah, non saprei.",
      "Non sono d'accordo.",
      "Per nulla!",
    ],
  },
  {
    id: 4,
    text: "Questa frase ti rappresenta?",
    statement: "Dedico del tempo a cercare di capirmi meglio",
    options: [
      "Decisamente sì!",
      "Sì, direi di sì.",
      "Mah, non saprei.",
      "Non sono d'accordo.",
      "Per nulla!",
    ],
  },
  {
    id: 5,
    text: "Questa frase ti rappresenta?",
    statement: "So cosa voglio e cosa mi piace veramente",
    options: [
      "Decisamente sì!",
      "Sì, direi di sì.",
      "Mah, non saprei.",
      "Non sono d'accordo.",
      "Per nulla!",
    ],
  },
  {
    id: 6,
    text: "Questa frase ti rappresenta?",
    statement: "Presto attenzione a come mi presento agli altri",
    options: [
      "Decisamente sì!",
      "Sì, direi di sì.",
      "Mah, non saprei.",
      "Non sono d'accordo.",
      "Per nulla!",
    ],
  },
  {
    id: 7,
    text: "Questa frase ti rappresenta?",
    statement: "Di solito mi preoccupo di fare una buona impressione",
    options: [
      "Decisamente sì!",
      "Sì, direi di sì.",
      "Mah, non saprei.",
      "Non sono d'accordo.",
      "Per nulla!",
    ],
  },
  {
    id: 8,
    text: "Questa frase ti rappresenta?",
    statement: "Mi piaccio così come sono, anche senza trucco",
    options: [
      "Decisamente sì!",
      "Sì, direi di sì.",
      "Mah, non saprei.",
      "Non sono d'accordo.",
      "Per nulla!",
    ],
  },
  {
    id: 9,
    text: "Questa frase ti rappresenta?",
    statement: "Indossare make-up mi avvicina all'ideale che ho di me",
    options: [
      "Decisamente sì!",
      "Sì, direi di sì.",
      "Mah, non saprei.",
      "Non sono d'accordo.",
      "Per nulla!",
    ],
  },
  {
    id: 10,
    text: "Questa frase ti rappresenta?",
    statement: "Mi sento a mio agio nelle situazioni sociali (ad esempio cene, riunioni, compleanni…)",
    options: [
      "Decisamente sì!",
      "Sì, direi di sì.",
      "Mah, non saprei.",
      "Non sono d'accordo.",
      "Per nulla!",
    ],
  },
];

export default function Questionnaire() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate progress percentage - adjust for 10 questions
  const progressPercentage = (currentQuestionIndex / questions.length) * 100;

  const handleAnswer = (option) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = option;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (!answers[currentQuestionIndex]) return;

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Submit answers to backend
      submitAnswers();
    }
  };

  const submitAnswers = async () => {
    try {
      // Prevent multiple submissions
      if (isSubmitting) {
        console.log("Already submitting, ignoring duplicate request");
        return;
      }
      
      setIsSubmitting(true);
      console.log("Starting submission process");
      
      // Map from UI options to backend values
      const optionMapping = {
        "Decisamente sì!": "strongly_agree",
        "Sì, direi di sì.": "agree",
        "Mah, non saprei.": "neutral",
        "Non sono d'accordo.": "disagree",
        "Per nulla!": "strongly_disagree"
      };
      
      // Format answers as q1, q2, etc. with values from the mapping
      const formattedAnswers = {};
      for (let i = 0; i < questions.length; i++) {
        const questionKey = `q${i+1}`;
        const selectedOption = answers[i];
        const backendValue = optionMapping[selectedOption];
        
        formattedAnswers[questionKey] = backendValue;
      }

      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      console.log("Creating new consultation with answers");
      const response = await axios.post(
        `${API_BASE_URL}/consultations`, 
        { answers: formattedAnswers },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log("Consultation created successfully:", response.data);
      
      // Store consultation ID in localStorage
      let consultationId = null;
      if (response.data && response.data.consultation_id) {
        consultationId = parseInt(response.data.consultation_id, 10);
      } else if (response.data && response.data.id) {
        consultationId = parseInt(response.data.id, 10);
      }
      
      if (consultationId) {
        console.log("Storing consultation ID in localStorage:", consultationId);
        localStorage.setItem('consultation_id', consultationId);
      }
      
      // Navigate to finish page with consultation data
      console.log("Navigating to FinishTest with consultation data");
      navigate("/FinishTest", { 
        state: { 
          answers,
          consultationData: {
            ...response.data,
            consultation_id: consultationId,
            id: consultationId
          }
        } 
      });
    } catch (error) {
      console.error('Error submitting answers:', error);
      navigate("/FinishTest", { state: { answers } });
    } finally {
      // Reset submission state
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center p-[14px] gap-3">
        <Link to="/ConsultantMain">
          <button className="p-2">
            <X size={24} color="#1E1E1E" />
          </button>
        </Link>
        <div className="">
          <p className="font-helvetica font-bold text-[20px] sm:hidden">
            10 domande per tro...
          </p>
          <p className="font-helvetica font-bold text-[16px] hidden sm:block">
            10 domande per trovare il tuo look
          </p>
        </div>
      </div>

      {/* Progress Bar with initial animation */}
      <div className="w-full bg-gray-200 h-1">
        <div 
          className="bg-[#1E1E1E] h-1 transition-all duration-500 ease-in-out animate-progress-start"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Center the grid container */}
      <div className="flex justify-center w-full">
        <Grid>
          {/* Main content - spans all 6 columns */}
          <div className="col-span-4 md:col-span-6 flex flex-col min-h-[90vh]">
            <div className="w-full flex-grow">
              {/* Question text with increased top padding and spacing between elements */}
              <div className="w-full mt-8 md:mt-10 md:pl-0">
                <span className="text-sm text-[#8F8F8F] block mb-2">
                  Domanda {currentQuestionIndex + 1}/10
                </span>
                <h3 className="font-helvetica font-semibold text-[17px] leading-[26px] tracking-[0px] w-full">
                  {questions[currentQuestionIndex].text}
                </h3>
              </div>

              {/* Statement and options */}
              <div className="mt-8 md:mt-50 space-y-3 flex flex-col gap-[9px] w-full md:w-2/3 md:mx-auto">
                <div className="w-full">
                  <p className="font-bold mt-2 text-[24px] md:text-[26px] font-helvetica leading-[32px] md:leading-[31px] tracking-normal w-full h-[95px] overflow-hidden">
                    "{questions[currentQuestionIndex].statement}"
                  </p>
                </div>
                <div className="flex flex-col items-start gap-[7px] md:gap-[13px] lg:gap-[15px] w-full md:mt-[3%]">
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <button
                      key={index}
                      className={`w-full text-left border py-3 transition pl-[10px] pt-[7px] pb-[7px] rounded-[2px] ${
                        answers[currentQuestionIndex] === option
                          ? "bg-[#1E1E1E] text-white"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleAnswer(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="grid grid-cols-2 md:flex md:justify-end items-center gap-6 mt-auto py-10 md:w-2/3 md:mx-auto">
              <button
                className={`flex items-center justify-start h-[60px] md:h-[42px] px-4 ${
                  currentQuestionIndex === 0
                    ? "text-[#8F8F8F] opacity-50 cursor-not-allowed"
                    : "text-[#1E1E1E] font-medium hover:underline"
                }`}
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 19l-7-7 7-7" 
                  />
                </svg>
                Indietro
              </button>
              <button
                className={`flex items-center justify-center h-[52px] md:h-[42px] px-6 rounded-[2px] ${
                  answers[currentQuestionIndex]
                    ? "bg-[#1E1E1E] text-white"
                    : "bg-[#D9D9D9] text-white cursor-not-allowed"
                }`}
                onClick={handleNext}
                disabled={!answers[currentQuestionIndex]}
              >
                {currentQuestionIndex === questions.length - 1 ? "Finisci" : "Avanti"}
                {currentQuestionIndex !== questions.length - 1 && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7" 
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </Grid>
      </div>

      {/* CSS animation */}
      <style jsx>{`
        @keyframes progressStart {
          from { width: 0%; }
          to { width: ${progressPercentage}%; }
        }
        
        .animate-progress-start {
          animation: progressStart 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
