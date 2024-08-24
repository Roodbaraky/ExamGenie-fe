import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user_role } = useAuth();

  useEffect(() => {
    console.log(user_role);
  }, [user_role]);
  const navigate = useNavigate();
  return (
    <>
      <div className="flex self-center items-center justify-center gap-4 h-full">
        <div
          className="btn btn-lg"
          onClick={() => {
            navigate("/questions");
          }}
        >
          Generate Questions
        </div>
        <div
          className={`btn btn-lg ${
            user_role && user_role === "admin" ? "" : "btn-disabled"
          }`}
          onClick={() => {
            if (user_role === "admin") navigate("/upload");
          }}
        >
          Upload Questions
        </div>
      </div>
    </>
  );
}
