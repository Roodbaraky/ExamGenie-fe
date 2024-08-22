import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import QuestionsForm from "./components/QuestionsForm";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import { supabase } from "./utils/supabaseClient";
import { useAuth } from "./hooks/useAuth";

function App() {
  const {session} = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      setTimeout(() => {
        navigate("/");
      }, 50);
    }
  }, [navigate, session]);

  if (!session) {
    return <Login client={supabase} />;
  } else {
    return (
      <>
        <h1 className="text-7xl text-center btn mb-10 w-fit h-fit self-center rounded-xl" onClick={()=>{navigate('/')}}>ExamGenie</h1>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/questions" element={<QuestionsForm />} />
        </Routes>
      </>
    );
  }
}

export default App;
