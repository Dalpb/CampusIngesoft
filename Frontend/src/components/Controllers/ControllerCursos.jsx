import { Button } from '../Button/Button';
import { ButtonSpecial } from '../Button/ButtonSpecial';
import { getNotesList } from '../../services/coursesServices';
import { useNavigate } from 'react-router-dom';
import { useLocation} from 'react-router-dom';
import { useState} from 'react';
import { InputTextSearchTable } from '../Inputs/InputTextSearchTable';
import { CicloDropdown, NivelDropdownDir } from '../Inputs/Dropdown';
import { useEffect } from 'react';
import { getCourses } from '../../services/coursesServices';
import { Bar, BarOption } from "../../components/Bars/Bar"
import { InputText, SelectInput } from "../../components/Inputs/InputText"

export function ControllerCursos({setClave, setNombre, setNivel, setCursos}) {
    const [tempClave, setTempClave] = useState(""); // Entrada temporal para clave
    const [tempNombre, setTempNombre] = useState(""); // Entrada temporal para nombre
    const [tempNivel, setTempNivel] = useState(""); // Entrada temporal para nivel

    // Opciones para el dropdown de nivel
    const niveles = [
        { value: "E", label: "Nivel 0 (Electivo)" },
        ...Array.from({ length: 10 }, (_, i) => ({
            value: (i + 1).toString(),
            label: `Nivel ${i + 1}`,
        })),
    ];

    // Aplicar filtros
    const handleSearch = async () => {
        setClave(tempClave);
        setNombre(tempNombre);
        setNivel(tempNivel);

        try {
            const data = await getCourses({
                page: 1,
                clave: tempClave,
                nombre: tempNombre,
                nivel: tempNivel,
            });
            setCursos(data.results); // Actualizar los cursos con los datos filtrados
        } catch (error) {
            console.error("Error al buscar cursos:", error);
        }
    };

    // Limpiar filtros
    const handleCleanFilters = async () => {
        setTempClave("");
        setTempNombre("");
        setTempNivel("");
        setClave("");
        setNombre("");
        setNivel("");

        try {
            const data = await getCourses({ page: 1 });
            setCursos(data.results); // Cargar todos los cursos
        } catch (error) {
            console.error("Error al limpiar filtros:", error);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <Bar className="lg:grid-cols-4 md:grid-cols-3 gap-4">
                <InputText
                label="Código del Curso"
                description="Ingrese el código del curso"
                placeholder="Ejm: IFSI12"
                value={tempClave} // Conectado al estado
                onchange={(e) => setTempClave(e.target.value)} // Actualizar estado
                />
                <InputText 
                label="Nombre del Curso"
                description="Ingrese el nombre del curso"
                placeholder="Física 1"
                value={tempNombre} // Conectado al estado
                onchange={(e) => setTempNombre(e.target.value)} // Actualizar estado
                className="col-span-2" 
                />
                <SelectInput 
                label="Nivel"
                description="Cursos del nivel"
                value={tempNivel} // Conectado al estado
                onchange={(e) => {
                    setTempNivel(e.target.value); // Guardar el valor seleccionado
                    console.log("Nivel seleccionado:", e.target.value);
                    filterCursos();
                }}
                className="h-11">
                    <option value="">Seleccione el nivel</option>
                    {niveles.map((nivel) => (
                        <option key={nivel.value} value={nivel.value}>
                            {nivel.label}
                        </option>
                    ))}
                </SelectInput>
                <div className="col-span-full flex justify-end gap-4 mt-1">
                    <ButtonSpecial type="Clean" action={handleCleanFilters} variant="secondary" className="w-auto px-4"/>
                    <ButtonSpecial type="Search" action={handleSearch} className="w-auto px-6"/>
                </div>
            </Bar>
        </div>

    );
}
