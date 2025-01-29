export function removeTempValuesSubcompetition(){
    for(let i=0; i<localStorage.length;i++){
        const key = localStorage.key(i);
        if(key.startsWith("valuesInit") || key.startsWith("feedbacks"))localStorage.removeItem(key);
    }
}