const reservedKeys = require("./../resources/reservedKeys");
const ignorePull = require("./../resources/ignorePull");
const utils = require("../utils.js");

class TokensHandler {

    constructor() {
        this._idMap = new Map();
        this._idCount = 1;
        this._ignoreQueue = new Queue();
        this._ignoreFlag = false;
        this._stringFlag = false;
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
        if(this._ignoreFlag || this._isNotNecessary(value))
            return "";
        
        const tokenKey = this._getTokenType(value);

        return `[${tokenKey},${this._idMap[value] || value}]`;
    }

    _getTokenType(value) {

        if (this._stringFlag === true)
            return "string_literal";
        
        if (utils.isNumber(value))
            return "num";

        if (reservedKeys[value])
            return reservedKeys[value];

        if (!this._idMap[value])
            this._idMap[value] = this._idCount++;
        
        return "id";
    }

    _isNotNecessary(value) {
        if (this._isComment(value) || this._isString(value))
            return true;

        if (ignorePull[value])
            this._ignoreQueue.push(ignorePull[value])

        if (this._ignoreQueue.next() === value) {
            this._ignoreQueue.shift();
            return true;
        }

        return false;
    }

    _isComment(value) {
        let currentStatus = this._ignoreFlag;
        
        if (value === "//" || value === "/*") {
            this._ignoreFlag = true;
        } else if (value === "*/") {
            this._ignoreFlag = false;
        }

        return currentStatus !== this._ignoreFlag;
    }

    _isString(value) {
        let currentStatus = this._stringFlag;

        if (value === `"`) {
            this._stringFlag = !(this._stringFlag);
        }

        return currentStatus !== this._stringFlag;
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