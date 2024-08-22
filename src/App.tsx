import { HouseRounded } from "@mui/icons-material";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import QuestionsForm from "./components/QuestionsForm";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import { supabase } from "./utils/supabaseClient";

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
      <>
        <nav className="grid grid-cols-3 p-4 mb-10">
          {pathName && pathName !== "/" && (
            <HouseRounded
              className=" col-start-1 col-span-1 self-center justify-self-center scale-125"
              onClick={() => {
                navigate("/");
              }}
            />
          )}

          <h1 className="text-7xl text-center self-center justify-self-center w-fit h-fit col-start-2 col-span-1 rounded-xl">
            ExamGenie
          </h1>
          {session && (
            <div className="col-start-3 col-span-1 self-center justify-self-center flex items-center gap-2">
              <h2>{user_role}</h2>
              <a
                className="btn w-fit h-fit"
                onClick={() => {
                  setToken(null)
                  window.location.reload()
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
      </>
    );
  }
}

export default App;
