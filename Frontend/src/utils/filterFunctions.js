
export function filterByName(pattern,nameList){
    const newList = [];
    newList = nameList.filter(name=>{
       return name.includes(pattern);
    });
    return newList;
}