import React from 'react';

interface TitleProps {
  children: React.ReactNode;
}

export const Title = ({ children }: TitleProps) => {
  return <h1 className="text-2xl font-bold">{children}</h1>;
};
