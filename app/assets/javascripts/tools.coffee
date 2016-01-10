window.capitalize   = (string) -> string.charAt(0).toUpperCase() + string.slice(1)

window.insertCommas = (x)      -> x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

window.sortObject   = (a,b)    -> 
    return 1 if a.value < b.value
    return -1 if a.value > b.value

window.makeSum      = (array)  ->
    total = 0
    total = total + element for element in array
    return total

window.isLastElement = (index, array) ->
    return (array[array.length - 1] == array[index])