import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import QuestionsForm from "./components/QuestionsForm";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PUBLIC_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const LogIn = () => {
  return (
    <div className="flex flex-col">
      <h1 className="text-7xl text-center">ExamGenie</h1>
      <div className="flex flex-col self-center min-w-[320px] justify-center mt-24">
        <h2 className="text-2xl text-center">Log in</h2>
        <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
      </div>
    </div>
  );
};
function App() {
  const [session, setSession] = useState<null | Session>(null);

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

  if (!session) {
    return <LogIn />;
  } else {
    return (
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<QuestionsForm />} />
        </Routes>
      </>
    );
  }
}

export default App;
