interface ErrorProps extends React.HTMLProps<HTMLDivElement> {
  message: string;
}
export const Error = ({ message }: ErrorProps) => {
  return (
    <div role="alert" id='alert'  className="alert alert-error fixed top-20">
      <svg
      onClick={()=>{(document.getElementById('alert')as HTMLDivElement).style.display='none'}}
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
};
