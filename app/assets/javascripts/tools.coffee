window.insertCommas = (x) -> x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
window.capitalize = (string) -> string.charAt(0).toUpperCase() + string.slice(1)
window.sortObject = (a,b) -> 
        return 1 if a.value < b.value
        return -1 if a.value > b.value