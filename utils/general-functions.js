function exist (input) {
    if(!input || input=='') return false
    return true
}

function getTimeDate(string) {
    const arr = string.split("-")
    try {
        const date = new Date(Number(arr[0]),Number(arr[1])-1,Number(arr[2]))
        return date.getTime()
    } catch (e) {
        console.log(e)
    }
    return 0
}

function nowTime() {
    const date = new Date()
    
    // b.toLocaleString()
    return date.getTime()
}

function getDateByNumber(num) {
    if(num==0) return '' 
    const d = new Date(num)
    const arr = d.toLocaleDateString().split('/')
    return `${cifNum(Number(arr[2]))}-${cifNum(Number(arr[1]))}-${cifNum(Number(arr[0]))}`
}
function cifNum(num) {
    if(num<10) return `0${num}`;
    return `${num}`
}

module.exports = {
    exist,
    getTimeDate,
    nowTime,
    getDateByNumber
}