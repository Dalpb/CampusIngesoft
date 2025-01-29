import { useCSVUpload } from '../../../hooks/useCSVUpdolad'
import { Button,ButtonSecondary } from '../../Button/Button'
import { useState ,useEffect} from 'react';
export const FileSubmitPopup = ({controlOpen,setData,requireHeaders = []}) =>{
  
  const {data,error,handleFileSubmit,fileName} = useCSVUpload(requireHeaders);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
      setIsVisible(true);
  }, []);

  const handleSubmit =() => {
      if(error){
          alert(error);
          return;
      }
      if(data.length > 0){
        setData(data);
        handleClose();
      }
  }

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() =>{
        controlOpen(false);
    }, 200); 
  };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`bg-white rounded-lg shadow-lg w-96  transform transition-all duration-300 ease-in-out py-6 px-5 ${
            isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Importar calificaciones</h2>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleFileChange(e); 
              }}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center cursor-pointer"
            >
              <input
                type="file"
                onChange={(event) =>handleFileSubmit(event)} 
                accept=".csv"
                className="hidden"
                id="fileInput"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <div className={`w-12 h-12 mx-auto mb-2 border-2 rounded-full flex items-center justify-center transition-colors duration-300 ${data.length > 0 ? 'text-green-500 border-green-500' : 'text-gray-400 border-gray-400'}`}>
                  <span className="text-2xl">↑</span>
                </div>
                <p className={`${data.length > 0 ? 'text-green-500' : 'text-gray-500'}`}>
                  {data.length > 0 ? `${fileName}` : 'Arrastra el archivo CSV'}
                </p>
              </label>
            </div>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>} 
            <p className="text-sm text-gray-600 mb-4">Campos del CSV:<br/> 
              {
                requireHeaders.map(head => `  <${head}>`)
              }</p>
            <div className="flex justify-center gap-2">
              <div>
                <ButtonSecondary
                txt="Cancelar"
                type="button"
                action={handleClose} />
              </div>
              <div>
                <Button
                txt="Continuar"
                type="button"
                disable={data.length <= 0}
                action={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
    );
  
}