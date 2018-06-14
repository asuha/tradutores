const grammar = require("../resources/languageGrammar.json");

class GrammarHandler {
    constructor() {
        this.initialSymbol = "program";
    }

    next(key) {
        return grammar[key || this.initialSymbol];
    }

    isTerminal(key) {
        return /^'(.+)'$|^[a-zA-Z]+-*[a-zA-Z]*$/.test(key);
    }

    getTerminal(key) {
        let result = /^'(.+)'$|^[a-zA-Z]+-*[a-zA-Z]*$/.exec(key);

        return result[1] ? result[1] : result[0];
    }

    isNonTerminalSymbol(key) {
        return /<.+>/.test(key);
    }

    getNonTerminalSymbol(key) {
        if (this.isNonTerminalSymbol(key)) {
            return /<(.+)>/.exec(key)[1];
        }
    }

}

module.exports = GrammarHandler;