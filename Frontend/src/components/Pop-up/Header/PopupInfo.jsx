import React from "react";

export function PopupInfo({ title, isOpen, onClose, userInformation, avatarUrl, children }) {
    return (
        <div
            className={`fixed inset-0 bg-black/50 flex justify-center items-center z-50 transition-opacity duration-300 ${
                isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
            {/* Modal Content */}
            <div
                className={`bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative transition-transform duration-300 transform ${
                    isOpen ? "scale-100" : "scale-95"
                }`}
            >
                {/* Header */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-300">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-black hover:text-gray-600 font-extrabold text-2xl leading-none transform hover:scale-110 transition duration-200"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="mt-4">
                    {/* Mostrar Avatar */}
                    {avatarUrl && (
                        <img
                            src={avatarUrl}
                            alt={`${userInformation?.tipo_usuario || "Usuario"} Avatar`}
                            className="w-24 h-24 rounded-full mb-4 mx-auto"
                        />
                    )}
                    {children}
                </div>
            </div>
        </div>
    );
}
