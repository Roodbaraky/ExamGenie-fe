import { HouseRounded } from "@mui/icons-material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Footer } from "./components/Footer";
import Login from "./components/Login";
import QuestionsForm from "./components/QuestionsForm";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import { supabase } from "./utils/supabaseClient";

const queryClient = new QueryClient();

function App() {
  const { session, user_role, setToken } = useAuth();
  const navigate = useNavigate();
  const pathName = window.location.pathname;

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
          className="min-h-100vh flex h-screen w-full flex-col bg-base-300"
        >
          <nav className="grid grid-cols-3 bg-secondary p-4 drop-shadow-md">
            {pathName && pathName !== "/" && (
              <HouseRounded
                className="col-span-1 col-start-1 scale-125 cursor-pointer self-center justify-self-center"
                onClick={() => {
                  navigate("/");
                }}
              />
            )}
            <h1 className="col-span-1 col-start-2 h-fit w-fit self-center justify-self-center rounded-xl text-center text-7xl">
              ExamGenie
            </h1>
            {session && (
              <div className="flex items-center gap-2 self-center justify-self-center">
                <h2>{user_role}</h2>
                <a
                  className="btn h-fit w-fit"
                  onClick={() => {
                    setToken(null);
                    window.location.reload();
                  }}
                >
                  Log out
                </a>
              </div>
            )}
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/questions" element={<QuestionsForm />} />
          </Routes>

          <Footer className="relative bottom-0 mx-auto w-full" />
        </main>
      </QueryClientProvider>
    );
  }
}

export default App;
