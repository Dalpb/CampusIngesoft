import {UserIcon,  } from "./IconHeader";
import { useState } from "react";
import { PopupInfo } from "../Pop-up/Header/PopupInfo";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

export function Header({children,title,userName,itsBack}){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {logout, userInformation } = useAuth(); // Obtener información del usuario
    const navigate = useNavigate(); // Usar el hook navigate

    // Definir los avatares por tipo de usuario
    const avatars = {
        alumno: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Prescription01&hairColor=Brown&facialHairType=Blank&clotheType=Hoodie&clotheColor=PastelBlue&eyeType=Happy&eyebrowType=DefaultNatural&mouthType=Smile&skinColor=Light", // Reemplaza con el avatar del alumno
        profesor: "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Round&hairColor=Black&facialHairType=BeardLight&clotheType=BlazerSweater&clotheColor=Gray01&eyeType=Default&eyebrowType=RaisedExcitedNatural&mouthType=Default&skinColor=Tanned", // Reemplaza con el avatar del profesor
    };

    // Obtener el avatar correspondiente al tipo de usuario
    const avatarUrl = avatars[userInformation?.tipo_usuario] || avatars.alumno;

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleOptionClick = (option) => {
        if (option === "info") {
            setIsModalOpen(true); // Abre el modal de información del usuario
        } else if (option === "courses") {
            console.log("Navegando a mis cursos...");
            navigate("/mis-cursos"); // Cambia esta ruta
        } else if (option === "logout") {
            console.log("Cerrando sesión...");
            logout(); // Llama a la función logout del contexto
            navigate("/all-logout"); // Navega sin recargar la página
        }
    };

    return (
        <header className="flex shadow w-full bg-clrNavbar overflow-visible">
            <div className="w-full h-20 max-w-7x1 flex justify-between items-center px-5 sm:px-6 lg:px-8">
                {children}
                <div className="ml-auto flex gap-3 sm:gap-5 items-center relative">
                    {/* Avatar + Name with Hover and Active State */}
                    <div
                        onClick={toggleMenu}
                        className={`cursor-pointer relative flex items-center gap-2 p-2 rounded-lg transition ${
                            isMenuOpen ? "bg-white/10 text-gray-300" : "hover:bg-white/10 text-white"
                        }`}
                    >
                        <div
                            className="w-10 h-10 rounded-full flex justify-center items-center"
                            style={{ backgroundColor: "transparent" }} // Fondo del círculo blanco
                        >
                            <img
                                src={avatarUrl}
                                alt="User Avatar"
                                className="w-8 h-8 rounded-full"
                                style={{ backgroundColor: "transparent" }} // Fondo transparente dentro del avatar
                            />
                        </div>
                        <p className={`lg:text-base md:text-sm text-xs transition`}>
                            {userName}
                        </p>
                    </div>

                    {/* Dropdown Menu */}
                    <div
                        className={`absolute mt-2 right-0 w-56 bg-white shadow-lg rounded-lg z-50 transition-all duration-300 transform ${
                            isMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                        }`}
                        style={{ top: "100%" }}
                    >
                        {/* Cabecera del Menú */}
                        <div className="px-4 py-2 bg-gray-100 rounded-t-lg border-b">
                            <p className="font-bold text-clrNavbar">Mi Cuenta</p>
                        </div>
                        <ul className="text-gray-700">
                            {/* Información del Usuario */}
                            <li
                                onClick={() => handleOptionClick("info")}
                                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                Información del Usuario
                            </li>
                            {/* Cerrar Sesión */}
                            <li
                                onClick={() => handleOptionClick("logout")}
                                className="flex items-center px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer rounded-b-lg"
                            >
                                Cerrar Sesión
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Modal with User Information */}
            <PopupInfo
                title="Información del Usuario"
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userInformation={userInformation}
                avatarUrl={avatarUrl} // Pasar el avatar correspondiente
            >
                <div className="text-gray-800 space-y-2">
                    <p>
                        <span className="font-bold">Nombre:</span> {userInformation?.nombre}{" "}
                        {userInformation?.primerApellido} {userInformation?.segundoApellido}
                    </p>
                    <p>
                        <span className="font-bold">Código:</span> {userInformation?.codigo || "N/A"}
                    </p>
                    <p>
                        <span className="font-bold">Correo:</span> {userInformation?.correo || "N/A"}
                    </p>
                    <p>
                        <span className="font-bold">Teléfono:</span> {userInformation?.telefono || "N/A"}
                    </p>
                    <p>
                        <span className="font-bold">Estado:</span> {userInformation?.estado || "N/A"}
                    </p>
                </div>
            </PopupInfo>
        </header>
    );
}