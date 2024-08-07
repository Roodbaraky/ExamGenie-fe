import { Route, Routes } from "react-router-dom";
import QuestionsForm from "./components/QuestionsForm";


function App() {
  return (
    <>
      <h1 className="text-7xl text-center">ExamGenie</h1>
   
    <Routes>
      <Route path="/questions" element={<QuestionsForm/>}/>
    </Routes>
    </>
  );
}

export default App;
