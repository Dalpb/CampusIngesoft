export function InfoCard({ props }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-wrap justify-between items-start gap-4 max-w-6xl mt-8 mx-auto">
      {props.map((item, index) => (
        <div
          key={index}
          className={`flex-grow min-w-[150px] sm:flex-grow-0 sm:min-w-0 ${
            item.label === "Factor de desempeño" || item.label === "Turno de matrícula"
              ? "text-center"
              : "text-center sm:text-left"
          }`}
        >
          <p className="text-gray-500 font-medium text-sm sm:text-base">{item.label}</p>
          <p className="font-bold">
            {item.value}
            {item.boldValue && <span className="font-bold"> {item.boldValue}</span>}
          </p>
        </div>
      ))}
    </div>
  );
}