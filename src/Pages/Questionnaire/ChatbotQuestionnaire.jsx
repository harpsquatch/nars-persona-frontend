import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../../services/api";
import { Body2, H3 } from "../../Components/atoms/Typography";

// Typing indicator component
const TypingIndicator = () => (
  <motion.div 
    className="flex gap-1 p-3 bg-gray-100 rounded-2xl w-16"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="w-2 h-2 bg-gray-400 rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
    />
    <motion.div
      className="w-2 h-2 bg-gray-400 rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
    />
    <motion.div
      className="w-2 h-2 bg-gray-400 rounded-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
    />
  </motion.div>
);

// Chat bubble component
const ChatBubble = ({ message, isBot, delay = 0 }) => (
  <motion.div
    className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <div
      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
        isBot 
          ? 'bg-gray-100 text-black rounded-tl-none' 
          : 'bg-black text-white rounded-tr-none'
      }`}
    >
      <Body2 className={isBot ? 'text-black' : 'text-white'}>
        {message}
      </Body2>
    </div>
  </motion.div>
);

// Quick reply button component
const QuickReply = ({ text, onClick, delay = 0 }) => (
  <motion.button
    className="bg-[#000000] text-white font-light px-6 py-3 rounded-[2px]"
    onClick={onClick}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3, delay }}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
  >
    <Body2 className="text-white whitespace-nowrap">{text}</Body2>
  </motion.button>
);

// Questions data
const conversationFlow = [
  {
    type: 'intro',
    botMessages: [
      "Hi! I'm your NARS beauty consultant 💄",
      "I'm here to help you discover your unique makeup archetype.",
      "Ready to get started?"
    ],
    options: ["Let's go!", "Yes, I'm ready!"]
  },
  {
    type: 'question',
    id: 1,
    botMessage: "First question: I think I'm worth at least as much as other people.",
    botFollow: "Does this represent you?",
    options: ["Definitely yes!", "Yes, I'd say so.", "Not sure.", "I disagree.", "Not at all!"]
  },
  {
    type: 'question',
    id: 2,
    botMessage: "When I don't wear makeup, I feel less attractive or less comfortable with my appearance.",
    botFollow: "How about this one?",
    options: ["Definitely yes!", "Yes, I'd say so.", "Not sure.", "I disagree.", "Not at all!"]
  },
  {
    type: 'question',
    id: 3,
    botMessage: "I appreciate myself for who I am.",
    botFollow: "Does this sound like you?",
    options: ["Definitely yes!", "Yes, I'd say so.", "Not sure.", "I disagree.", "Not at all!"]
  },
  {
    type: 'question',
    id: 4,
    botMessage: "I dedicate time to trying to understand myself better.",
    botFollow: "What do you think?",
    options: ["Definitely yes!", "Yes, I'd say so.", "Not sure.", "I disagree.", "Not at all!"]
  },
  {
    type: 'question',
    id: 5,
    botMessage: "I know what I want and what I really like.",
    botFollow: "How would you respond?",
    options: ["Definitely yes!", "Yes, I'd say so.", "Not sure.", "I disagree.", "Not at all!"]
  },
  {
    type: 'question',
    id: 6,
    botMessage: "I pay attention to how I present myself to others.",
    botFollow: "Does this describe you?",
    options: ["Definitely yes!", "Yes, I'd say so.", "Not sure.", "I disagree.", "Not at all!"]
  },
  {
    type: 'question',
    id: 7,
    botMessage: "I usually care about making a good impression.",
    botFollow: "What about this?",
    options: ["Definitely yes!", "Yes, I'd say so.", "Not sure.", "I disagree.", "Not at all!"]
  },
  {
    type: 'question',
    id: 8,
    botMessage: "I like myself as I am, even without makeup.",
    botFollow: "Your thoughts?",
    options: ["Definitely yes!", "Yes, I'd say so.", "Not sure.", "I disagree.", "Not at all!"]
  },
  {
    type: 'question',
    id: 9,
    botMessage: "I feel comfortable sharing my thoughts and ideas with others.",
    botFollow: "Does this resonate with you?",
    options: ["Definitely yes!", "Yes, I'd say so.", "Not sure.", "I disagree.", "Not at all!"]
  },
  {
    type: 'question',
    id: 10,
    botMessage: "I actively seek to improve myself and my skills.",
    botFollow: "Last personality question!",
    options: ["Definitely yes!", "Yes, I'd say so.", "Not sure.", "I disagree.", "Not at all!"]
  },
  {
    type: 'transition',
    botMessages: [
      "Great! Now I have a better sense of your personality ✨",
      "Next, let me understand your style preferences."
    ]
  },
  {
    type: 'aesthetics',
    botMessage: "Choose 3 aesthetics that feel most like YOU:",
    options: [
      "Clean minimal",
      "Soft romantic",
      "Bold glam",
      "High fashion",
      "Edgy",
      "Natural glow",
      "Corporate polish",
      "Playful"
    ]
  },
  {
    type: 'transition',
    botMessages: [
      "Love your choices! 🎨",
      "Now, tell me about your lifestyle."
    ]
  },
  {
    type: 'lifestyle_time',
    botMessage: "How much time do you have for makeup daily?",
    options: ["5 min", "10 min", "20+ min"]
  },
  {
    type: 'lifestyle_skill',
    botMessage: "What's your makeup skill level?",
    options: ["Beginner", "Intermediate", "Advanced"]
  },
  {
    type: 'lifestyle_risk',
    botMessage: "Your comfort with trying new looks?",
    options: ["Safe", "Balanced", "Bold"]
  },
  {
    type: 'complete',
    botMessages: [
      "Amazing! I have everything I need 🎉",
      "Calculating your perfect archetype..."
    ]
  }
];

export default function ChatbotQuestionnaire() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const hasStarted = useRef(false);
  
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showOptions]);

  // Start conversation
  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      startConversation();
    }
  }, []);

  const startConversation = async () => {
    const intro = conversationFlow[0];
    
    for (let i = 0; i < intro.botMessages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, i === 0 ? 500 : 1500));
      setIsTyping(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsTyping(false);
      
      setMessages(prev => [...prev, { text: intro.botMessages[i], isBot: true }]);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setShowOptions(true);
  };

  // Map chatbot answers to backend format
  const mapAnswerToBackend = (answer) => {
    const mapping = {
      "Definitely yes!": "strongly_agree",
      "Yes, I'd say so.": "agree",
      "Not sure.": "neutral",
      "I disagree.": "disagree",
      "Not at all!": "strongly_disagree"
    };
    return mapping[answer] || answer;
  };

  const handleAnswer = async (answer, stepData) => {
    // Add user's answer to chat
    setMessages(prev => [...prev, { text: answer, isBot: false }]);
    setShowOptions(false);

    // Store answer
    const newAnswers = { ...answers };
    
    if (stepData.type === 'question') {
      newAnswers[`q${stepData.id}`] = mapAnswerToBackend(answer);
    } else if (stepData.type === 'aesthetics') {
      if (!newAnswers.aesthetics) newAnswers.aesthetics = [];
      if (newAnswers.aesthetics.includes(answer)) {
        newAnswers.aesthetics = newAnswers.aesthetics.filter(a => a !== answer);
      } else if (newAnswers.aesthetics.length < 3) {
        newAnswers.aesthetics.push(answer);
      }
      
      // If 3 selected, move to next
      if (newAnswers.aesthetics.length === 3) {
        setAnswers(newAnswers);
        moveToNextStep();
        return;
      } else {
        setAnswers(newAnswers);
        setShowOptions(true);
        return;
      }
    } else if (stepData.type === 'lifestyle_time') {
      newAnswers.lifestyle_time = answer;
    } else if (stepData.type === 'lifestyle_skill') {
      newAnswers.lifestyle_skill = answer;
    } else if (stepData.type === 'lifestyle_risk') {
      newAnswers.lifestyle_risk = answer;
    }
    
    setAnswers(newAnswers);

    // Move to next step
    await new Promise(resolve => setTimeout(resolve, 800));
    moveToNextStep();
  };

  const moveToNextStep = async (fromStepIndex = null) => {
    const currentIndex = fromStepIndex !== null ? fromStepIndex : currentStep;
    const nextStepIndex = currentIndex + 1;
    
    if (nextStepIndex >= conversationFlow.length) {
      // Submit answers
      await submitAnswers();
      return;
    }

    setCurrentStep(nextStepIndex);
    const nextStep = conversationFlow[nextStepIndex];

    if (nextStep.type === 'transition') {
      // Show transition messages
      for (let i = 0; i < nextStep.botMessages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsTyping(true);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsTyping(false);
        
        setMessages(prev => [...prev, { text: nextStep.botMessages[i], isBot: true }]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      // Pass the current index to avoid state sync issues
      moveToNextStep(nextStepIndex);
    } else if (nextStep.type === 'complete') {
      // Show completion messages
      for (let i = 0; i < nextStep.botMessages.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsTyping(true);
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsTyping(false);
        
        setMessages(prev => [...prev, { text: nextStep.botMessages[i], isBot: true }]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      await submitAnswers();
    } else {
      // Show bot message
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsTyping(true);
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      setIsTyping(false);
      
      setMessages(prev => [...prev, { text: nextStep.botMessage, isBot: true }]);
      
      if (nextStep.botFollow) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsTyping(true);
        
        await new Promise(resolve => setTimeout(resolve, 600));
        setIsTyping(false);
        
        setMessages(prev => [...prev, { text: nextStep.botFollow, isBot: true }]);
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowOptions(true);
    }
  };

  const submitAnswers = async () => {
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Format answers for backend - keep as object with q1, q2, etc. keys
      const formattedAnswers = Object.entries(answers)
        .filter(([key]) => key.startsWith('q'))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      console.log('Submitting answers:', formattedAnswers);
      console.log('All collected data:', answers);

      if (token) {
        // Existing user - submit consultation
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

        navigate("/FinishTest", {
          state: {
            answers: formattedAnswers,
            consultationData: response.data
          }
        });
      } else {
        // New user - navigate to signup with all data
        navigate("/SignupForm", {
          state: {
            answers: formattedAnswers,
            aesthetics: answers.aesthetics,
            lifestyle: {
              time: answers.lifestyle_time,
              skill: answers.lifestyle_skill,
              risk: answers.lifestyle_risk
            }
          }
        });
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      setIsSubmitting(false);
    }
  };

  const currentStepData = conversationFlow[currentStep];

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <H3>NARS Consultant</H3>
        <button
          onClick={() => navigate('/')}
          className="p-2"
        >
          <X size={24} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-1">
        <motion.div
          className="bg-black h-1"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / conversationFlow.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            message={msg.text}
            isBot={msg.isBot}
            delay={0}
          />
        ))}
        
        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Options area */}
      <AnimatePresence>
        {showOptions && currentStepData && (
          <motion.div
            className="p-4 border-t bg-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
              {currentStepData.options?.map((option, index) => (
                <QuickReply
                  key={index}
                  text={option}
                  onClick={() => handleAnswer(option, currentStepData)}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

