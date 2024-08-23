import React from 'react'

export const Wrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="max-w-[95%] w-full flex flex-col mx-auto h-screen max-h-screen  border-l border-r drop-shadow-sm">
      {children}
    </div>
  );
};