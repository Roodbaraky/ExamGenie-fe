import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
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
