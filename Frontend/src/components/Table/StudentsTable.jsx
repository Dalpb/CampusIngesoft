import { useEffect, useState } from "react";

export function StudentsTable({ students }) {
  const [isSelected, setSelected] = useState(new Array(students.length).fill(false));
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  const changeIndex = (index) => {
    const newState = [...isSelected];
    newState.fill(false);
    newState[index] = !newState[index];
    setSelected(newState);
  };

  const changeNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const changePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    changeIndex(0);
  }, []);

  const filteredStudents = students.filter((student) =>
    student.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="overflow-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full bg-white">
        <thead className="bg-clrTableHeader text-white">
          <tr>
            <th className="text-left p-3 text-white font-bold">Código</th>
            <th className="text-left p-3 text-white font-bold">Nombre Completo</th>
            <th className="text-left p-3 text-white font-bold">Correo Electrónico</th>
            <th className="text-left p-3 text-white font-bold">Estado</th>
            <th className="text-left p-3 text-white font-bold text-center">Nota Final</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student, index) => (
            <tr
              key={index}
              className="border-b bg-white"
            >
              <td className="py-3 px-4">{student.codigo}</td>
              <td className="py-3 px-4">{student.nombre}</td>
              <td className="py-3 px-4">{student.correo}</td>
              <td className="py-3 px-4">{student.estado}</td>
              <td
                className={`py-3 px-4 text-center ${student.nota > 10 ? 'text-green-500' : 'text-red-500'}`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {student.nota}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 items-center gap-2 mb-4">
        <button
          onClick={changePrevious}
          className="px-3 py-1 border rounded bg-white border-gray-300 hover:bg-gray-200"
          disabled={currentPage === 1}
        >
          {"<<"}
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-clrhoverButton text-white' : 'bg-white border-gray-300 hover:bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={changeNext}
          className="px-3 py-1 border rounded bg-white border-gray-300 hover:bg-gray-200"
          disabled={currentPage === totalPages}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
}

export function SquareIndex({ number, isSelected, onChange }) {
  const result = isSelected
    ? "bg-bgLoginOne text-white"
    : "bg-white border-2 border-bgLoginOne text-black";

  return (
    <div
      className={`${result} w-10 h-10 flex justify-center items-center text-2xl cursor-pointer`}
      onClick={onChange}
    >
      {number}
    </div>
  );
}