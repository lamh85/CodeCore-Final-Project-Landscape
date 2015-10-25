var insertCommas = function(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

var sortObject = function(a,b) {
    if (a.value > b.value)
        return -1;
    if (a.value < b.value)
        return 1;
        return 0;
}