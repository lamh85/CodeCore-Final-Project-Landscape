window =
    insertCommas: (x) -> x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    capitalize: (string) -> string.charAt(0).toUpperCase() + string.slice(1)

    sortObject: (a,b) -> 
        1 if a.value < b.value
        -1 if a.value > b.value