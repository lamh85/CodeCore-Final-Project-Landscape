insertCommas = (x) -> return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

capitalize = (string) -> return string.charAt(0).toUpperCase() + string.slice(1)

sortObject = (a,b) -> 
    return -1 if a.value > b.value
    return 1

sortObject = (a,b) ->
    if a.value > b.value
        return -1
    if a.value < b.value
        return 1
    else
        return 0