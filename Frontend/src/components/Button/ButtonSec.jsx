export function ButtonSec({txt,action}){

    return(
        <button className="font-medium bg-white text-bgLoginOne text-center  w-full px-4 py-2 h-11 rounded-md hover:bg-clrhoverButton
        hover:text-white
        transform transition-transform duration-20 active:scale-95 border-bgLoginOne border">
            {txt}
        </button>
    )
}