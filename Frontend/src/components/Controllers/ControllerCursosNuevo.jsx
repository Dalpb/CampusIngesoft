import { Bar } from '../../components/Bars/Bar';
import { InputText, SelectInput } from '../../components/Inputs/InputText';
import { ButtonSpecial } from '../../components/Button/ButtonSpecial';
import { useState } from 'react';

export function ControllerCursosNuevo({ onFilter , setTempClave, setTempNivel, setTempNombre, tempClave, tempNivel, tempNombre }) {
    const niveles = [
    { value: 'E', label: 'Nivel 0 (Electivo)' },
    ...Array.from({ length: 10 }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Nivel ${i + 1}`,
    })),
  ];

  const handleSearch = () => {
    onFilter({ clave: tempClave, nombre: tempNombre, nivel: tempNivel });
  };

  const handleCleanFilters = () => {
    setTempClave('');
    setTempNombre('');
    setTempNivel('');
    onFilter({ clave: '', nombre: '', nivel: '' });
  };

  return (
    <div className="flex flex-col gap-3">
      <Bar className="lg:grid-cols-4 md:grid-cols-3 gap-4">
        <InputText
          label="Código del Curso"
          description="Ingrese el código del curso"
          placeholder="Ejm: INF247"
          value={tempClave}
          onchange={(e) => setTempClave(e.target.value)}
        />
        <InputText
          label="Nombre del Curso"
          description="Ingrese el nombre del curso"
          placeholder="Física 1"
          value={tempNombre}
          onchange={(e) => setTempNombre(e.target.value)}
          className="col-span-2"
        />
        <SelectInput
          label="Nivel"
          description="Cursos del nivel"
          value={tempNivel}
          onchange={(e) => setTempNivel(e.target.value)}
          className="h-11"
        >
          <option value="">Seleccione el nivel</option>
          {niveles.map((nivel) => (
            <option key={nivel.value} value={nivel.value}>
              {nivel.label}
            </option>
          ))}
        </SelectInput>
        <div className="col-span-full flex justify-end gap-4 mt-1">
          <ButtonSpecial type="Clean" action={handleCleanFilters} variant="secondary" className="w-auto px-4" />
          <ButtonSpecial type="Search" action={handleSearch} className="w-auto px-6" />
        </div>
      </Bar>
    </div>
  );
}
