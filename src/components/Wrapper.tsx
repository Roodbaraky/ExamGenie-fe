import React from 'react'

export const Wrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className=" w-full flex flex-col mx-auto min-h-screen h-screen max-h-screen  border-l border-r drop-shadow-sm">
      {children}
    </div>
  );
};