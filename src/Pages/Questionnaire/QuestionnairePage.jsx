import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Grid } from "../../Components/Grid";
import { API_BASE_URL } from "../../services/api";

const questions = [
  {
    id: 1,
    text: "Does this statement represent you?",
    statement: "I think I'm worth at least as much as other people",
    options: [
      "Definitely yes!",
      "Yes, I'd say so.",
      "Not sure.",
      "I disagree.",
      "Not at all!",
    ],
  },
  {
    id: 2,
    text: "Does this statement represent you?",
    statement: "When I don't wear makeup, I feel less attractive or less comfortable with my appearance",
    options: [
      "Definitely yes!",
      "Yes, I'd say so.",
      "Not sure.",
      "I disagree.",
      "Not at all!",
    ],
  },
  {
    id: 3,
    text: "Does this statement represent you?",
    statement: "I appreciate myself for who I am",
    options: [
      "Definitely yes!",
      "Yes, I'd say so.",
      "Not sure.",
      "I disagree.",
      "Not at all!",
    ],
  },
  {
    id: 4,
    text: "Does this statement represent you?",
    statement: "I dedicate time to trying to understand myself better",
    options: [
      "Definitely yes!",
      "Yes, I'd say so.",
      "Not sure.",
      "I disagree.",
      "Not at all!",
    ],
  },
  {
    id: 5,
    text: "Does this statement represent you?",
    statement: "I know what I want and what I really like",
    options: [
      "Definitely yes!",
      "Yes, I'd say so.",
      "Not sure.",
      "I disagree.",
      "Not at all!",
    ],
  },
  {
    id: 6,
    text: "Does this statement represent you?",
    statement: "I pay attention to how I present myself to others",
    options: [
      "Definitely yes!",
      "Yes, I'd say so.",
      "Not sure.",
      "I disagree.",
      "Not at all!",
    ],
  },
  {
    id: 7,
    text: "Does this statement represent you?",
    statement: "I usually care about making a good impression",
    options: [
      "Definitely yes!",
      "Yes, I'd say so.",
      "Not sure.",
      "I disagree.",
      "Not at all!",
    ],
  },
  {
    id: 8,
    text: "Does this statement represent you?",
    statement: "I like myself as I am, even without makeup",
    options: [
      "Definitely yes!",
      "Yes, I'd say so.",
      "Not sure.",
      "I disagree.",
      "Not at all!",
    ],
  },
  {
    id: 9,
    text: "Does this statement represent you?",
    statement: "Wearing makeup brings me closer to my ideal self",
    options: [
      "Definitely yes!",
      "Yes, I'd say so.",
      "Not sure.",
      "I disagree.",
      "Not at all!",
    ],
  },
  {
    id: 10,
    text: "Does this statement represent you?",
    statement: "I feel comfortable in social situations (e.g. dinners, meetings, birthdays…)",
    options: [
      "Definitely yes!",
      "Yes, I'd say so.",
      "Not sure.",
      "I disagree.",
      "Not at all!",
    ],
  },
];

export default function Questionnaire() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Additional steps
  const [showAestheticPreferences, setShowAestheticPreferences] = useState(false);
  const [showLifestyleConstraints, setShowLifestyleConstraints] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  
  // Aesthetic preferences
  const [aestheticPreferences, setAestheticPreferences] = useState([]);
  
  // Lifestyle constraints
  const [lifestyleData, setLifestyleData] = useState({
    timeDaily: "",
    skillLevel: "",
    riskTolerance: ""
  });
  
  // Profile fields
  const [profileData, setProfileData] = useState({
    skinTone: "",
    undertone: "",
    hairColor: "",
    eyeColor: "",
    skinType: ""
  });

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
      // Show aesthetic preferences after last question
      setShowAestheticPreferences(true);
    }
  };
  
  const handleAestheticToggle = (aesthetic) => {
    setAestheticPreferences(prev => {
      if (prev.includes(aesthetic)) {
        return prev.filter(a => a !== aesthetic);
      } else if (prev.length < 3) {
        return [...prev, aesthetic];
      }
      return prev;
    });
  };
  
  const handleAestheticContinue = () => {
    if (aestheticPreferences.length !== 3) {
      alert("Please select exactly 3 aesthetic preferences");
      return;
    }
    setShowLifestyleConstraints(true);
  };
  
  const handleLifestyleChange = (field, value) => {
    setLifestyleData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleLifestyleContinue = () => {
    if (!lifestyleData.timeDaily || !lifestyleData.skillLevel || !lifestyleData.riskTolerance) {
      alert("Please complete all lifestyle preferences");
      return;
    }
    setShowProfileForm(true);
  };
  
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleProfileSubmit = () => {
    // Validate profile data
    if (!profileData.skinTone || !profileData.undertone || !profileData.hairColor || 
        !profileData.eyeColor || !profileData.skinType) {
      alert("Please complete all profile fields");
      return;
    }
    submitAnswers();
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
        "Definitely yes!": "strongly_agree",
        "Yes, I'd say so.": "agree",
        "Not sure.": "neutral",
        "I disagree.": "disagree",
        "Not at all!": "strongly_disagree"
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
      
      if (token) {
        // Existing user - create consultation
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
      } else {
        // New user - navigate to signup form with answers and profile data
        console.log("New user - navigating to signup form");
        navigate("/SignupForm", { 
          state: { 
            answers: formattedAnswers,
            profile: profileData,
            aesthetics: aestheticPreferences,
            lifestyle: lifestyleData
          } 
        });
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      // For new users, still go to signup even if there's an error
      const token = localStorage.getItem('token');
      if (!token) {
        // Navigate to signup for new users
        const optionMapping = {
          "Definitely yes!": "strongly_agree",
          "Yes, I'd say so.": "agree",
          "Not sure.": "neutral",
          "I disagree.": "disagree",
          "Not at all!": "strongly_disagree"
        };
        const formattedAnswers = {};
        for (let i = 0; i < questions.length; i++) {
          const questionKey = `q${i+1}`;
          const selectedOption = answers[i];
          const backendValue = optionMapping[selectedOption];
          formattedAnswers[questionKey] = backendValue;
        }
        navigate("/SignupForm", { state: { answers: formattedAnswers, profile: profileData, aesthetics: aestheticPreferences, lifestyle: lifestyleData } });
      } else {
      navigate("/FinishTest", { state: { answers } });
      }
    } finally {
      // Reset submission state
      setIsSubmitting(false);
    }
  };

  const skinTones = [
    { name: 'Fair', value: 'fair', color: '#FFE5D9' },
    { name: 'Light', value: 'light', color: '#F5D5C1' },
    { name: 'Medium', value: 'medium', color: '#E0BC9D' },
    { name: 'Tan', value: 'tan', color: '#C99876' },
    { name: 'Deep', value: 'deep', color: '#8B5A3C' },
    { name: 'Rich', value: 'rich', color: '#5C3D2E' }
  ];
  
  const aestheticOptions = [
    { value: 'clean_minimal', label: 'Clean minimal', emoji: '✨' },
    { value: 'soft_romantic', label: 'Soft romantic', emoji: '🌸' },
    { value: 'bold_glam', label: 'Bold glam', emoji: '💎' },
    { value: 'high_fashion', label: 'High fashion', emoji: '👗' },
    { value: 'edgy', label: 'Edgy', emoji: '⚡' },
    { value: 'natural_glow', label: 'Natural glow', emoji: '☀️' },
    { value: 'corporate_polish', label: 'Corporate polish', emoji: '💼' },
    { value: 'playful', label: 'Playful', emoji: '🎨' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center p-[14px] gap-3">
        <Link to="/ConsultantInfo">
          <button className="p-2">
            <X size={24} color="#1E1E1E" />
          </button>
        </Link>
        <div className="">
          <p className="font-helvetica font-bold text-[20px] sm:hidden">
            10 questions to find...
          </p>
          <p className="font-helvetica font-bold text-[16px] hidden sm:block">
            10 questions to find your look
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1">
        <div 
          className="bg-[#1E1E1E] h-1 transition-all duration-500 ease-in-out animate-progress-start"
          style={{ width: `${showProfileForm ? 100 : showLifestyleConstraints ? 100 : showAestheticPreferences ? 100 : progressPercentage}%` }}
        ></div>
      </div>

      {/* Center the grid container */}
      <div className="flex justify-center w-full">
        <Grid>
          {/* Main content - spans all 6 columns */}
          <div className="col-span-4 md:col-span-6 flex flex-col min-h-[90vh]">
            {!showAestheticPreferences && !showLifestyleConstraints && !showProfileForm ? (
              // Question View
              <>
            <div className="w-full flex-grow">
                  {/* Question text */}
              <div className="w-full mt-8 md:mt-10 md:pl-0">
                <span className="text-sm text-[#8F8F8F] block mb-2">
                      Question {currentQuestionIndex + 1}/10
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
                    Back
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
                    {currentQuestionIndex === questions.length - 1 ? "Next" : "Next"}
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
              </>
            ) : showAestheticPreferences && !showLifestyleConstraints && !showProfileForm ? (
              // Aesthetic Preferences View
              <div className="w-full flex-grow py-8">
                <div className="w-full md:w-2/3 md:mx-auto space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Choose 3 that feel like you</h2>
                    <p className="text-gray-600">Select exactly 3 aesthetic preferences</p>
                    <p className="text-sm text-gray-500 mt-1">{aestheticPreferences.length}/3 selected</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {aestheticOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => handleAestheticToggle(option.value)}
                        disabled={!aestheticPreferences.includes(option.value) && aestheticPreferences.length >= 3}
                        className={`relative p-6 rounded-lg border-2 transition-all ${
                          aestheticPreferences.includes(option.value)
                            ? 'border-black bg-black text-white shadow-lg scale-105'
                            : aestheticPreferences.length >= 3
                            ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-3xl">{option.emoji}</span>
                          <span className="text-base font-medium text-center">{option.label}</span>
                        </div>
                        {aestheticPreferences.includes(option.value) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      onClick={() => setShowAestheticPreferences(false)}
                      className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleAestheticContinue}
                      className={`flex-1 py-3 px-6 rounded-lg transition ${
                        aestheticPreferences.length !== 3
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ) : showLifestyleConstraints && !showProfileForm ? (
              // Lifestyle Constraints View
              <div className="w-full flex-grow py-8">
                <div className="w-full md:w-2/3 md:mx-auto space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Lifestyle Preferences</h2>
                    <p className="text-gray-600">Help us tailor recommendations to your routine</p>
                  </div>

                  {/* Time Daily */}
                  <div className="space-y-3">
                    <label className="block text-base font-semibold">How much time do you have daily? *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: '5min', label: '5 min' },
                        { value: '10min', label: '10 min' },
                        { value: '20min', label: '20+ min' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleLifestyleChange('timeDaily', option.value)}
                          className={`py-4 px-4 rounded-lg border-2 transition ${
                            lifestyleData.timeDaily === option.value
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skill Level */}
                  <div className="space-y-3">
                    <label className="block text-base font-semibold">Skill level *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                        <button
                          key={level}
                          onClick={() => handleLifestyleChange('skillLevel', level.toLowerCase())}
                          className={`py-4 px-4 rounded-lg border-2 transition ${
                            lifestyleData.skillLevel === level.toLowerCase()
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Risk Tolerance */}
                  <div className="space-y-3">
                    <label className="block text-base font-semibold">Risk tolerance *</label>
                    <p className="text-sm text-gray-500">How adventurous are you with makeup?</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'safe', label: 'Safe', desc: 'Classic & timeless' },
                        { value: 'balanced', label: 'Balanced', desc: 'Mix it up' },
                        { value: 'bold', label: 'Bold', desc: 'Push boundaries' }
                      ].map(option => (
                        <button
                          key={option.value}
                          onClick={() => handleLifestyleChange('riskTolerance', option.value)}
                          className={`py-4 px-4 rounded-lg border-2 transition flex flex-col items-center ${
                            lifestyleData.riskTolerance === option.value
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <span className="font-medium">{option.label}</span>
                          <span className={`text-xs mt-1 ${
                            lifestyleData.riskTolerance === option.value ? 'text-gray-300' : 'text-gray-500'
                          }`}>
                            {option.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-4 pt-6">
                    <button
                      onClick={() => setShowLifestyleConstraints(false)}
                      className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleLifestyleContinue}
                      className={`flex-1 py-3 px-6 rounded-lg transition ${
                        !lifestyleData.timeDaily || !lifestyleData.skillLevel || !lifestyleData.riskTolerance
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Profile Form View
              <div className="w-full flex-grow py-8">
                <div className="w-full md:w-2/3 md:mx-auto space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
                    <p className="text-gray-600">This helps us personalize your recommendations</p>
                  </div>

                  {/* Skin Tone Selector */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold">Skin Tone *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {skinTones.map(tone => (
                        <button
                          key={tone.value}
                          onClick={() => handleProfileChange('skinTone', tone.value)}
                          className={`flex flex-col items-center p-3 rounded-lg border-2 transition ${
                            profileData.skinTone === tone.value 
                              ? 'border-black bg-gray-50' 
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <div 
                            className="w-12 h-12 rounded-full mb-2 border-2 border-gray-300"
                            style={{ backgroundColor: tone.color }}
                          />
                          <span className="text-xs font-medium">{tone.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Undertone */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold">Undertone *</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Warm', 'Cool', 'Neutral', 'Unsure'].map(option => (
                        <button
                          key={option}
                          onClick={() => handleProfileChange('undertone', option.toLowerCase())}
                          className={`py-3 px-4 rounded-lg border-2 transition ${
                            profileData.undertone === option.toLowerCase()
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hair Color */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold">Hair Color *</label>
                    <select
                      value={profileData.hairColor}
                      onChange={(e) => handleProfileChange('hairColor', e.target.value)}
                      className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                    >
                      <option value="">Select hair color</option>
                      <option value="black">Black</option>
                      <option value="brown">Brown</option>
                      <option value="blonde">Blonde</option>
                      <option value="red">Red</option>
                      <option value="gray">Gray/White</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Eye Color */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold">Eye Color *</label>
                    <select
                      value={profileData.eyeColor}
                      onChange={(e) => handleProfileChange('eyeColor', e.target.value)}
                      className="w-full py-3 px-4 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                    >
                      <option value="">Select eye color</option>
                      <option value="brown">Brown</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="hazel">Hazel</option>
                      <option value="gray">Gray</option>
                      <option value="amber">Amber</option>
                    </select>
                  </div>

                  {/* Skin Type */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold">Skin Type *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Oily', 'Dry', 'Combination'].map(option => (
                        <button
                          key={option}
                          onClick={() => handleProfileChange('skinType', option.toLowerCase())}
                          className={`py-3 px-4 rounded-lg border-2 transition ${
                            profileData.skinType === option.toLowerCase()
                              ? 'border-black bg-black text-white'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4 pt-6">
                    <button
                      onClick={() => setShowProfileForm(false)}
                      className="flex-1 py-3 px-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleProfileSubmit}
                      disabled={isSubmitting}
                      className={`flex-1 py-3 px-6 rounded-lg transition ${
                        !profileData.skinTone || !profileData.undertone || !profileData.hairColor || 
                        !profileData.eyeColor || !profileData.skinType || isSubmitting
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-gray-800'
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Continue'}
                    </button>
                  </div>
                </div>
              </div>
            )}
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
