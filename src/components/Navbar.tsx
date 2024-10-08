import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


export const Navbar = () => {
    const { session, user_role, setToken } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="grid grid-cols-3 bg-secondary p-2 drop-shadow-md">
    <h1
      className="col-span-1 col-start-1 h-fit w-fit cursor-pointer self-start rounded-xl text-start text-5xl hover:drop-shadow-xl"
      onClick={() => {
        navigate("/");
      }}
    >
      Recall - Prototype
    </h1>
    {session && (
      <div className="col-start-3 flex items-end gap-2 self-center justify-self-end">
        <h2 className="badge badge-secondary h-fit w-fit">{user_role}</h2>
        <a
          className="badge badge-secondary hover:badge-primary h-fit w-fit cursor-pointer"
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
  )
}
