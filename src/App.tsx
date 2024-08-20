import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import QuestionsForm from "./components/QuestionsForm";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import { supabase } from "./utils/supabaseClient";

function App() {
  const [session, setSession] = useState<null | Session>(null);
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);
  useEffect(()=>{
    if(!session){
      console.log('useEffect test')
      navigate('/')
    }
  },[navigate, session])

  if (!session) {
    return <Login client={supabase} />;
  } else {
    return (
      <>
        <h1 className="text-7xl text-center">ExamGenie</h1>
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
