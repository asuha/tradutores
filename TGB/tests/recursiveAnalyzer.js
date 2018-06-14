const test = require('tape');
const RecursiveAnalyzer = require("./../src/models/RecursiveAnalyzer");

test('different options', t => {
    let tokens = [["reserved_word", "int"], ["id", "teste"], ["equal", "="], ["intConstant", "int"], ["semicolon", ";"]];
    let analyzer = new RecursiveAnalyzer(tokens);

    analyzer.analyze("field-decl");

    t.end();
});