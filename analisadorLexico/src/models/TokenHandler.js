const reservedKeys = require("./../resources/reservedKeys");
const ignorePull = require("./../resources/ignorePull");
const utils = require("../utils.js");

class TokensHandler {

    constructor() {
        this.idMap = new Map();
        this.idCount = 1;
        this.ignoreQueue = new Queue();
    }

    generateTokens(codeLine) {
        let commands = utils.split(codeLine);
        
        let tokens = commands.reduce((previous, current) => {
            return `${previous}${this._generateToken(current)}`;
        }, "");

        return tokens;
    }

    _generateToken(value) {
        if(this._isNotNecessary(value))
            return "";
        
        const tokenKey = this._getTokenType(value);

        return `[${tokenKey},${this.idMap[value] || value}]`;
    }

    _getTokenType(value) {
        
        if (utils.isNumber(value))
            return "num";

        if (reservedKeys[value])
            return reservedKeys[value];

        if (!this.idMap[value])
            this.idMap[value] = this.idCount++;
             
        return "id"
    }

    _isNotNecessary(value) {
        if (ignorePull[value])
            this.ignoreQueue.push(ignorePull[value])

        if (this.ignoreQueue.next() === value) {
            this.ignoreQueue.shift();
            return true;
        }

        return false;
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