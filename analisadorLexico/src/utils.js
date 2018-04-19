function isNumber(key){
    return !isNaN(key)
}

function split(line) {
    //Make sure you first check composed elements and then single ones.
    let values = line.split(/(\!=|<=|>=|==|&&|\/\/|\/\*|\*\/|=|<|>|\+|-|\*|&|\\|\(|\)|{|}|,|;|".*"| )/g);

    return values.filter(value => {
        return value !== undefined && value !== "" && value != " ";
    });
}

module.exports = {
    isNumber,
    split
}