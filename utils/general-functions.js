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

module.exports = {
    exist,
    getTimeDate
}