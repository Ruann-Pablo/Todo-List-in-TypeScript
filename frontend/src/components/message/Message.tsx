import React from "react";
import style from "./Message.module.css"; // seu arquivo de CSS para successMsg e errorMsg

interface MessageProps {
  message: string | null;
  type?: "success" | "error"; // tipo da mensagem
}

const Message: React.FC<MessageProps> = ({ message, type = "success" }) => {
  if (!message) return null; // não renderiza nada se não houver mensagem

  return (
    <p className={type === "success" ? style.successMsg : style.errorMsg}>
      {message}
    </p>
  );
};

export default Message;
