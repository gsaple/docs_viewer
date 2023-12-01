import { type FC } from "react";
import React from "react";

interface MessageProps {
  msg: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  type: string;
}

const Message: FC<MessageProps> = ({ msg, setMessage, type }) => {
  return (
    <div className={`alert alert-${type} alert-dismissible fade show`}>
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
