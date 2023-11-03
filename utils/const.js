const MAIN_PAGE = "http://localhost:5173/"

function mailFormater(name, arrText, isEnt=false) {
let text = `Estimado(a). ${name}.`
if(isEnt) text = `Estimada empresa ${name}.`

for(let i of arrText) {
    text+='\n'
    text+=i
}
text+=`\n \nSaludos cordiales,
Oficina de soporte PSP.`
return text
}


module.exports = {
    MAIN_PAGE,
    mailFormater
}