
class TokensHandler {
    constructor(tokens) {
        this.tokens = tokens;
    }

    consume() {
        this.tokens.shift();
    }

    //TODO: Create a stack that keep the consumed values
    // and a function that will only consume the values after
    // each analyze is correct

    getNext() {
        return this.tokens[0];
    }

    getNextValue() {
        return this.getNext()[1];
    }

    getNextKey() {
        return this.getNext()[0];
    }

    rollback(consumed) {
        this.tokens = consumed.concat(this.tokens);
    }

    getRelevantValue() {
        return this.getNextKey() == "id" ? this.getNextKey() : this.getNextValue();
    }

    isTerminal() {
        /^[a-zA-Z]+$|^'.+'$/.test(grammarToken)
    }
}

module.exports = TokensHandler;