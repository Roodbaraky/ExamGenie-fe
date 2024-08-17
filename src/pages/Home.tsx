import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <h1 className="text-7xl text-center">ExamGenie</h1>
      <div className="flex self-center justify-center">
        <div
          className="btn"
          onClick={() => {
            navigate("/questions");
          }}
        >
          Questions
        </div>
      </div>
    </>
  );
}
