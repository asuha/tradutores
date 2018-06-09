const reservedKeys = require("./../resources/reservedKeys");
const ignorePull = require("./../resources/ignorePull");
const utils = require("../utils.js");

class TokensHandler {

    constructor() {
        this._idMap = new Map();
        this._idCount = 1;
        this._ignoreQueue = new Queue();
        this._ignoreFlag = false;
    }

    generateTokens(codeLine) {
        let commands = utils.split(codeLine);
        
        let tokens = commands.reduce((previous, current) => {
            return `${previous}${this._generateToken(current)}`;
        }, "");

        this.afterGenerateTokens();
        
        return tokens;
    }

    _generateToken(value) {
        if(this._isNotNecessary(value) || this._ignoreFlag)
            return "";
        
        const tokenKey = this._getTokenType(value);

        if (this._isString(value))
            return `[${tokenKey},${/"(.*)"/.exec(value)[1]}]`;
        else 
            return `[${tokenKey},${this._idMap[value] || value}]`;
    }

    _getTokenType(value) {

        if (this._isString(value))
            return "string_literal";
        
        if (utils.isNumber(value))
            return "num";

        if (reservedKeys[value])
            return reservedKeys[value];

        if (!this._idMap[value])
            this._idMap[value] = this._idCount++;
        
        return "id";
    }

    _isString(value) {
        return /".*"/.test(value);
    }

    _isNotNecessary(value) {
        if (this._ignoreQueue.next() === value) {
            this._ignoreQueue.shift();
            return true;
        }

        if (this._ignoreQueue.length() > 0) {
            return true;
        }
        
        if (ignorePull[value]) {
            this._ignoreQueue.push(ignorePull[value]);
            return true;
        }

        if (this._isComment(value))
            return true;

        return false;
    }

    _isComment(value) {
        let currentStatus = this._ignoreFlag;
        
        if (value === "//") {
            this._ignoreFlag = true;
        }

        return currentStatus !== this._ignoreFlag;
    }

    afterGenerateTokens() {
        if (this._ignoreQueue.next() === "*/") {
            this._ignoreFlag = true;
        } else {
            this._ignoreFlag = false;
        }
    }
}

class Queue {
    constructor() {
        this._queue = []
    }

    shift() {
        return this._queue.shift();
    }

    push(value) {
        if (Array.isArray(value))
            return this._queue.push(...value);
        
        return this._queue.push(value);
    }

    length() {
        return this._queue.length;
    }

    next() {
        return this._queue[0];
    }

}

module.exports = TokensHandler;