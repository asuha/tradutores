const fs = require("fs");
const readline = require("readline");

class FileHandler {

    constructor(filePath) {
        this.lineReader = readline.createInterface({
            input: fs.createReadStream(filePath)
        });
    }

    onLine(callback) {
        this.lineReader.on('line', callback);
    }
}

module.exports = FileHandler;