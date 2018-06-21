const TokensHandler = require("./TokensHandler");

class RecursiveAnalyzer {
    constructor(tokens) {
        this.tokens = new TokensHandler(tokens);
        this.consumed = [];
        this.errorStack = [];
    }

    run() {

        try {
            this._program();
        } catch (e) {
            console.log("FODEU GALVAO!");
        }

        console.log("SUCESSSOU");
    }

    _program() {
        
        while(this.tokens.getNext()) {
            if (this.tokens.getNextValue() == "def") {
                this._func();
            } else {
                this._var();
            }
        }
    }

    _var() {
        this._type();

        this._id();

        if(this._checkAndConsume("[", {"isOptional": true})) {
            if (/[0-9]*/.test(this.tokens.getNextValue()))
                this._consume();
            else
                this._handleError();

            this._checkAndConsume("]");
        }

        this._checkAndConsume(";");
    }

    _func() {
        this._checkAndConsume("def");

        this._type();

        this._id();

        this._paramList();

        this._block();
    }

    _block() {
        this._checkAndConsume("{");

        while(!this._checkAndConsume("}", {isOptional: true})) {
            if (this._isType()) {
                this._var();
            } else {
                this._statement();
            }
        }
    }

    _statement() {
        if (this.tokens.getNextValue() == "if")
            this._if();
        
        else if (this.tokens.getNextValue() == "while")
            this._while();

        else if (this._checkAndConsume("return", {"isOptional": true})) {
            if (this.tokens.getNextValue() != ";")
                this._expr();

            this._checkAndConsume(";");
        }

        else if (this._checkAndConsume("continue", {"isOptional": true}))
            this._checkAndConsume(";");

        else if (this._checkAndConsume("break", {"isOptional": true}))
            this._checkAndConsume(";");

        else if (this.tokens.tokens[1][1] == "(") {
            this._funcCall();
            this._checkAndConsume(";");
        } else {
            this._loc();

            this._checkAndConsume("=");

            this._expr();

            this._checkAndConsume(";");
        }
    }

    _while() {
        this._checkAndConsume("while");

        this._checkAndConsume("(");

        this._expr();

        this._checkAndConsume(")");

        this._block();
    }

    _if() {
        this._checkAndConsume("if");

        this._checkAndConsume("(");

        this._expr();

        this._checkAndConsume(")");

        this._block();

        if(this._checkAndConsume("else", {isOptional: true}))
            this._block();
    }

    _expr() {
        const BINOP = ["||", "&&", "<=", ">=", "==", "!=", "<", ">", "+", "/", "-", "%", "*"];
        const UNOP = ["!", "-"];

        if(this._isLiteral())
            this._consume();

        else if(this.tokens.getNextKey() == "id") {
            if (this.tokens.tokens[1][1] == "(") {
                this._funcCall();
            }
            else {
                this._loc();
            }
        }

        else if(this._checkAndConsume("(")) {
            this._expr();
            
            this._checkAndConsume(")");
        }
        
        else this._checkAndConsume(UNOP, {isOptional: true})

        if (this._checkAndConsume(BINOP, {isOptional: true}))
            this._expr();
    }

    _loc() {
        this._checkAndConsume("id", {isKey: true});

        if (this._checkAndConsume("[", {isOptional: true})) {
            this._expr();

            this._checkAndConsume("]");
        }
    }

    _funcCall() {
        this._checkAndConsume("id", {isKey: true});

        this._checkAndConsume("(");

        if (this.tokens.getNextValue() != ")")
            this._argList();

        this._checkAndConsume(")")
    }

    _argList() {
        this._expr();

        while(this._checkAndConsume(",", {isOptional: true})) {
            this._expr();
        }
    }

    _isLiteral() {
        let key = this.tokens.getNextKey();
        if ( key == "num" || key == "string_literal" || key == "bool") {
            return true;
        }

        return false;
    }

    _isType() {
        let token = this.tokens.getNextValue();

        return token == "int" || token == "bool" || token == "void" || token == "double";
    }

    _paramList() {
        this._checkAndConsume("(");

        while(this._isType()) {
            this._type();

            this._id();

            if (!this._checkAndConsume(",", {isOptional: true})) {
                break;
            }
        }
        
        this._checkAndConsume(")");
    }

    _id(isOptional=false) {
        this._checkAndConsume("id", {"isKey": true, "isOptional": isOptional});
    }

    _type(options) {
        this._checkAndConsume(["int", "bool", "void", "double"], options);
    }

    /**
     * 
     * @param {string} value 
     * @param {*} options 
     * @param {boolean} options.isKey
     * @param {boolean} options.isOptional
     */
    _checkAndConsume(value, options = {isKey: false, isOptional: false}) {
        if (Array.isArray(value) == false) {
            value = [value];
        }

        let isValid = value.some((element) => {
            return options.isKey ? this.tokens.getNextKey() == element : this.tokens.getNextValue() == element;
        })

        if (isValid)
            this._consume();
        else if (!options.isOptional)
            this._handleError();

        return isValid;
    }

    _consume() {
        this.consumed.push(this.tokens.consume());
    }

    _handleError() {
        throw new Error("Invalid token at: " + this.tokens.getNext());
    }

}

module.exports = RecursiveAnalyzer;