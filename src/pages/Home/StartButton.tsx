import React, { type ComponentProps } from "react";

interface StartButtonProps extends ComponentProps<"button"> {
  text: string;
}
const StartButton: React.FC<StartButtonProps> = ({ text, ...props }) => {
  return (
    <button
      className="border border-white text-left mt-4 px-4 w-48 rounded-2xl h-14 relative text-black text-xl font-semibold group cursor-pointer"
      type="button"
      {...props}
    >
      <p className="group-hover:opacity-0 duration-300 font-bold">{text}</p>
      <div className="bg-brand-accent/60 rounded-xl h-12 w-1/4 flex items-center justify-center absolute right-1 top-1 group-hover:w-46 z-10 duration-500">
        <svg
          width="25px"
          height="25px"
          viewBox="0 0 15 15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.293 2.293a1 1 0 0 1 1.414 0l4.5 4.5a1 1 0 0 1 0 1.414l-4.5 4.5a1 1 0 0 1-1.414-1.414L11 8.5H1.5a1 1 0 0 1 0-2H11L8.293 3.707a1 1 0 0 1 0-1.414" />
        </svg>
      </div>
    </button>
  );
};

export default StartButton;
