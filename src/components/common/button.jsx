import React from "react";

const Button = ({ content, style, ...props }) => {
  return (
    <button className={style} {...props}>
      {content}
    </button>
  );
};

export default Button;
