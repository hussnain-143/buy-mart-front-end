import React from "react";

type ButtonProps = {
  content: React.ReactNode;
  style?: string;
  [key: string]: any;
};

const Button = ({ content, style, ...props } : ButtonProps) => {
  return (
    <button className={style} {...props}>
      {content}
    </button>
  );
};

export default Button;
