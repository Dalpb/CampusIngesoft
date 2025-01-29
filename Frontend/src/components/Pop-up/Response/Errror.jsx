import { Modal } from "../Modal"
import { Button } from "../../Button/Button"
const ErrorIcon = (className="") => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-10 w-10 ${className}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#EF4444"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        )
}
export const PopUpError = ({ isOpen,text,onContinue,className }) =>{
    return (
        <Modal isOpen={isOpen} className={className} onClose={onContinue}>
            <div className="mb-4 flex justify-center w-full">
                <ErrorIcon className ="" />
            </div>
            <h2 className="lg:text-xl md:text-lg text-base text-center font-bold mb-4 text-gray-800">{text}</h2>
            
        </Modal>
      );
}
