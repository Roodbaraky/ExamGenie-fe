import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Footer } from "./components/Footer";
import Login from "./components/Login";
import { Navbar } from "./components/Navbar";
import QuestionsForm from "./components/QuestionsForm";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import { supabase } from "./utils/supabaseClient";

const queryClient = new QueryClient();

function App() {
  const { session } = useAuth();
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
      <QueryClientProvider client={queryClient}>
        <main
          id="app-container"
          className="flex h-screen  w-full flex-col bg-base-300"
        >
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/questions" element={<QuestionsForm />} />
          </Routes>

          <Footer className=" self-end mt-auto mx-auto w-full" />
        </main>
      </QueryClientProvider>
    );
  }
}

export default App;
