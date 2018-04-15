function isArithmeticOperator(key) {
    return /\+|\-|\*|\//.test(key);
}

function isEqualOperator(key) {
    return /^=$/.test(key);
}

function isIgnoredKey(key) {
    return ignoredKeys[key] !== undefined;
}

function isNumber(key){
    return !isNaN(key)
}

function isReservedKey(key) {
    return reservedKeys[key] !== undefined;
}

function split(line) {
    //Make sure you first check composed elements and then single ones.
    let values = line.split(/(\!=)|(<=)|(>=)|(==)|(=)|(<)|(>)|(\+)|(-)|(\*)|(\\)|(\()|(\))|;| /g);

    return values.filter(value => {
        return value !== undefined && value !== "";
    });
}

module.exports = {
    isIgnoredKey,
    isNumber,
    isReservedKey,
    split
}