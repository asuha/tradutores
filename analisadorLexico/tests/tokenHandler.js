const test = require('tape');
const TokenHandler = require("./../src/models/TokenHandler");

test('variaveis e identificadores', function(t) {
    let tokenInstance = new TokenHandler();

    let code1 = "int x = 7;";
    let code2 = "int y;";

    t.equal(tokenInstance.generateTokens(code1), "[reserved_word,int][id,1][Equal_Op,=][num,7]");
    t.equal(tokenInstance.generateTokens(code2), "[reserved_word,int][id,2]");

    t.end();
});

test('constantes numéricas', function(t){
    let tokenInstance = new TokenHandler();

    let code = "int x = 7 + 25 * 52";

    t.equal(tokenInstance.generateTokens(code), "[reserved_word,int][id,1][Equal_Op,=][num,7][Arith_Op,+][num,25][Arith_Op,*][num,52]");

    t.end();
});

test('palavras reservadas', function(t){
    let tokenInstance = new TokenHandler();

    let code = "if( x == 10 )";
    console.log("teste 1");
    t.equal(tokenInstance.generateTokens(code), "[reserved_word,if][id,1][Relational_Op,==][num,10]");

    t.end();
});

test('operadores relacionais', function(t){
    let tokenInstance = new TokenHandler();

    let code = "while( x != 0)";

    console.log("teste 2");
    t.equal(tokenInstance.generateTokens(code), "[reserved_word,while][id,1][Relational_Op,!=][num,0]");

    t.end();
});

test('numeros de ponto flutuante (números reais)', function(t){
    let tokenInstance = new TokenHandler();

    let code = "int x = 7.15 - 2.13;";

    t.equal(tokenInstance.generateTokens(code), "[reserved_word,int][id,1][Equal_Op,=][num,7.15][Arith_Op,-][num,2.13]");

    t.end();
});