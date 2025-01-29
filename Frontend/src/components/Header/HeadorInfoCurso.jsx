export function InfoCursoCard({ props }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-wrap justify-between items-start gap-8 max-w-6xl mt-8 mx-auto">
      {props.map((item, index) => (
        <div key={index} className="flex-1 min-w-[150px] text-center">
          <p className="text-gray-500 font-semibold text-base lg:text-xl w-full whitespace-nowrap">{item.label}</p>
          <p className="font-bold text-3xl mt-2">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
