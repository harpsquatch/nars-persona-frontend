import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Authentication from './Pages/Authentication';
import ConsultantInfo from './Pages/ConsultanciesDetails/consultantinfo_new';
import ConsultantDataPage from './Pages/ConsultanciesList/ConsultantDataPage';
import LookDetails from './Pages/ConsultanciesDetails/LookDetails';
import StartTestPage from './Pages/Questionnaire/StartTestPage';
import QuestionnairePage from './Pages/Questionnaire/QuestionnairePage';
import ChatbotQuestionnaire from './Pages/Questionnaire/ChatbotQuestionnaire';
import FinishTest from './Pages/Questionnaire/FinishTest';
import SignupForm from './Pages/Questionnaire/SignupForm';
import Feedback from './Pages/FeedbackForm/Feedback';
import AdminDashboard from './Pages/AdminDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/Consultant" element={<Navigate to="/ConsultantInfo" replace />} />
        <Route path="/ConsultantMain" element={<Navigate to="/ConsultantInfo" replace />} />
        <Route path="/ConsultantInfo" element={<ConsultantInfo />} />
        <Route path="/ConsultantInfoNew" element={<Navigate to="/ConsultantInfo" replace />} />
        <Route path="/ConsultantDataPage" element={<ConsultantDataPage />} />
        <Route path="/LookDetails" element={<LookDetails />} />
        <Route path="/StartTestPage" element={<StartTestPage />} />
        <Route path="/QuestionnairePage" element={<QuestionnairePage />} />
        <Route path="/ChatbotQuestionnaire" element={<ChatbotQuestionnaire />} />
        <Route path="/SignupForm" element={<SignupForm />} />
        <Route path="/FinishTest" element={<FinishTest />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
