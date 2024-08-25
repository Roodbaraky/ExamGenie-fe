import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user_role } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="flex self-center  gap-4 h-fit">
        <div
          className="btn btn-lg"
          onClick={() => {
            navigate("/questions");
          }}
        >
          Generate Questions
        </div>
        <div className="divider divider-horizontal"></div>
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
    </div>
  );
}
