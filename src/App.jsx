import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authentication from './Pages/Authentication';
import ConsultantMain from "./Pages/ConsultanciesList/ConsultantMain";
import ConsultantInfo from './Pages/ConsultanciesDetails/ConsultantInfo';
import ConsultantDataPage from './Pages/ConsultanciesList/ConsultantDataPage';
import LookDetails from './Pages/ConsultanciesDetails/LookDetails';
import StartTestPage from './Pages/Questionnaire/StartTestPage';
import QuestionnairePage from './Pages/Questionnaire/QuestionnairePage';
import FinishTest from './Pages/Questionnaire/FinishTest';
import Feedback from './Pages/FeedbackForm/Feedback';
import AdminDashboard from './Pages/AdminDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/Consultant" element={<ConsultantMain />} />
        <Route path="/ConsultantInfo" element={<ConsultantInfo />} />
        <Route path="/ConsultantDataPage" element={<ConsultantDataPage />} />
        <Route path="/ConsultantMain" element={<ConsultantMain />} />
        <Route path="/LookDetails" element={<LookDetails />} />
        <Route path="/StartTestPage" element={<StartTestPage />} />
        <Route path="/QuestionnairePage" element={<QuestionnairePage />} />
        <Route path="/FinishTest" element={<FinishTest />} />
        <Route path="/Feedback" element={<Feedback />} />
        <Route path="/admin" element={<AdminDashboard />} />

      </Routes>
    </Router>
  );
}

export default App;
