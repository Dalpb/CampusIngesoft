import React from 'react'

export const InputCriteriosSubCompetencias = () => {
  return (
    <div className='mb-20'>
        <table class="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
                <tr class="bg-indigo-500 text-white text-center">
                    <th class="py-3 px-4">Inicial</th>
                    <th class="py-3 px-4">En proceso</th>
                    <th class="py-3 px-4">Satisfactorio</th>
                    <th class="py-3 px-4">Sobresaliente</th>
                </tr>
            </thead>
            <tbody>
                <tr class="text-center">
                    <td class="border-t border-gray-200">
                        <textarea rows="4" class="w-full p-2 border-none bg-gray-100 rounded focus:ring-2 focus:ring-indigo-400 focus:bg-white resize-none" placeholder="ej: El alumno no/si ..."></textarea>
                    </td>
                    <td class="border-t border-gray-200">
                        <textarea rows="4" class="w-full p-2 border-none bg-gray-100 rounded focus:ring-2 focus:ring-indigo-400 focus:bg-white resize-none" placeholder="ej: El alumno no/si ..."></textarea>
                    </td>
                    <td class="border-t border-gray-200">
                        <textarea rows="4" class="w-full p-2 border-none bg-gray-100 rounded focus:ring-2 focus:ring-indigo-400 focus:bg-white resize-none" placeholder="ej: El alumno no/si ..."></textarea>
                    </td>
                    <td class="border-t border-gray-200">
                        <textarea rows="4" class="w-full p-2 border-none bg-gray-100 rounded focus:ring-2 focus:ring-indigo-400 focus:bg-white resize-none" placeholder="ej: El alumno no/si ..."></textarea>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}
