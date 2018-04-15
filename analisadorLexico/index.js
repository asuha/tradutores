const Tokens = require("./src/models/TokenHandler");
const FileHandler = require("./src/models/FileHandler");

function main() {
    const token = new Tokens();
    const fileHandler = new FileHandler("./testInput.txt");
    
    fileHandler.onLine((line) => {
        console.log(token.generateTokens(line));
    });
    
}

main();




