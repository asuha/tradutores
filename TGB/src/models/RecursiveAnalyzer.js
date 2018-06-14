const TokensHandler = require("./TokensHandler");
const GrammarHandler = require("./GrammarHandler");

class RecursiveAnalyzer {
    constructor(tokens) {
        this.tokens = new TokensHandler(tokens);
        this.grammar = new GrammarHandler();
        this.consumed = [];
    }

    run() {
        this.analyze();
    }

    analyze(grammarToken) {
        let contextGrammar = this.grammar.next(grammarToken);

        let consumed = [];

        let isValid = contextGrammar.some(grammarOption => {
            
            for (let option of grammarOption) {
                if (this.isValidCode(option)) {
                    consumed.push(this.tokens.consume());
                } else {
                    this.tokens.rollback(consumed);
                    return false;
                }
            }

            return true;
        });

        if (!isValid)
            throw new Error("FODEU");
    }

    isValidCode(token) {
        if (this.grammar.isTerminal(token)) {
            if (this.grammar.getTerminal(token) == this.tokens.getRelevantValue()) {
                return true;
            }
        } 
        
        if (this.grammar.isNonTerminalSymbol(token)) {
            this.analyze(this.grammar.getNonTerminalSymbol(token));
            
            return true;
        }

        return false;
    }
}

module.exports = RecursiveAnalyzer;

//if (this.grammar.getTerminal(token) == this.tokens.getRelevantValue()) {