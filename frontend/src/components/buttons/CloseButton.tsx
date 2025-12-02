import React from "react";
import { useNavigate } from "react-router-dom";
import { CircleX } from "lucide-react"; 
import style from "./Buttons.module.css"; 

interface CloseButtonProps {
  to?: string;      
  onClick?: () => void; 
  className?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({ to = "/", onClick, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(); 
    } else {
      navigate(to);
    }
  };

  return (
    <button onClick={handleClick} className={`${style.closeButton} ${className || ""}`}>
      <CircleX />
    </button>
  );
};

export default CloseButton;

