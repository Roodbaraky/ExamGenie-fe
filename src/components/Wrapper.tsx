import React from 'react'

export const Wrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="max-w-[1200px] w-full flex flex-col mx-auto min-h-screen  border-l border-r">
      {children}
    </div>
  );
};