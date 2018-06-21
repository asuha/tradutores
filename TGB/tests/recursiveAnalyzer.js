const test = require('tape');
const RecursiveAnalyzer = require("./../src/models/RecursiveAnalyzer");

test('type - int', t => {
    let tokens = [["reserved_word", "int"]];
    let analyzer = new RecursiveAnalyzer(tokens);

    t.true(analyzer._type());
    t.true(analyzer.consumed.length == 1);

    t.end();
});

test('type - bool', t => {
    let tokens = [["reserved_word", "bool"]];
    let analyzer = new RecursiveAnalyzer(tokens);

    t.true(analyzer._type());
    t.true(analyzer.consumed.length == 1);

    t.end();
});

test('type - void', t => {
    let tokens = [["reserved_word", "void"]];
    let analyzer = new RecursiveAnalyzer(tokens);

    t.true(analyzer._type());
    t.true(analyzer.consumed.length == 1);

    t.end();
});

test('type - negative', t => {
    let tokens = [["reserved_word", "test"]];
    let analyzer = new RecursiveAnalyzer(tokens);

    t.false(analyzer._type({isOptional: true}));
    t.true(analyzer.consumed.length == 0);

    t.end();
});

test('id', t => {
    let tokens = [["id", "myFunc"]];    
    let analyzer = new RecursiveAnalyzer(tokens);

    t.true(analyzer._id());
    t.true(analyzer.consumed.length == 1);

    t.end();
});

test('id - negative', t => {
    let tokens = [["1id", "myFunc"]];    
    let analyzer = new RecursiveAnalyzer(tokens);

    t.false(analyzer._id({isOptional: true}));
    t.true(analyzer.consumed.length == 0);

    t.end();
});