const LexicalAnalyzer = require("./lexicalAnalyzer");
const RecursiveAnalyzer = require("./src/models/RecursiveAnalyzer");

const FileHandler = require("./src/models/FileHandler");

function main() {
    const fileHandler = new FileHandler(`${__dirname}/input.txt`);
    const lexicalAnalyzer = new LexicalAnalyzer();

    let tokens = [];

    fileHandler.onClose(() => {
        const recursiveAnalyzer = new RecursiveAnalyzer(tokens);
        recursiveAnalyzer.run();
    });

    fileHandler.onLine((line) => {
        lexicalAnalyzer.run(line).forEach((element) => {
            tokens.push(element);
        });
    });
}

main();