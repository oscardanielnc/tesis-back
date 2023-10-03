const MAIN_PAGE = "http://localhost:5173/"

function mailFormater(name, arrText) {
let text = `Estimado(a). ${name}.`

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