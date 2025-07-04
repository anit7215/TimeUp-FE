import React from "react";

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle?: (isOn: boolean) => void;
  disabled?: boolean;
}

export default function ToggleSwitch({ isOn, onToggle, disabled = false }: ToggleSwitchProps) {
  const handleClick = () => {
    if (!disabled) {
      onToggle?.(!isOn);
    }
  };

  const backgroundClass = () => {
    if (disabled) return "bg-gray-400";
    if (isOn) return "bg-blue"; 
    return "bg-[#D9D9D9]";
  };
  

  const cursorClass = disabled ? "cursor-not-allowed" : "cursor-pointer";
  const animationClass = disabled ? "" : isOn ? "animate-toggleOn" : "animate-toggleOff";

  return (
    <div
      onClick={handleClick}
      className={`w-[40px] h-[20px] rounded-[10px] relative transition-colors duration-300 ${backgroundClass()} ${cursorClass}`}
    >
    <div
    className={`w-[16px] h-[16px] bg-white rounded-full shadow-md absolute top-1/2 -translate-y-1/2 transition-all
      ${isOn ? "left-[22px]" : "left-[2px]"}`}
     />
    </div>
  );
}


