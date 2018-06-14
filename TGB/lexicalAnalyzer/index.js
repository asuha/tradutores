const Tokens = require("./src/models/TokenHandler");

class LexicalAnalyzer {
    constructor() {
        this.token = new Tokens();    
    }

    run(line) {
        return this.token.generateTokens(line);
    }

}

module.exports = LexicalAnalyzer;