import { type FC } from "react";
import React from "react";

interface MessageProps {
  msg: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const Message: FC<MessageProps> = ({ msg, setMessage }) => {
  return (
    <div
      className="alert alert-warning alert-dismissible fade show"
      role="alert"
    >
      {msg}
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        data-bs-dismiss="alert"
        onClick={() => setMessage("")}
      ></button>
    </div>
  );
};

export default Message;
