const test = require('tape');
const TokenHandler = require("./../src/models/TokenHandler");

test('variaveis e identificadores', t => {
    let tokenInstance = new TokenHandler();

    let code1 = "int x = 7;";
    let code2 = "int y;";

    t.equal(tokenInstance.generateTokens(code1), "[reserved_word,int][id,1][Equal_Op,=][num,7]");
    t.equal(tokenInstance.generateTokens(code2), "[reserved_word,int][id,2]");

    t.end();
});

test('constantes numéricas', t => {
    let tokenInstance = new TokenHandler();

    let code = "int x = 7 + 25 * 52";

    t.equal(tokenInstance.generateTokens(code), "[reserved_word,int][id,1][Equal_Op,=][num,7][Arith_Op,+][num,25][Arith_Op,*][num,52]");

    t.end();
});

test('palavras reservadas', t => {
    let tokenInstance = new TokenHandler();

    let code = "if( x == 10 )";
    console.log("teste 1");
    t.equal(tokenInstance.generateTokens(code), "[reserved_word,if][id,1][Relational_Op,==][num,10]");

    t.end();
});

test('operadores relacionais', t => {
    let tokenInstance = new TokenHandler();

    let code = "while( x != 0)";

    console.log("teste 2");
    t.equal(tokenInstance.generateTokens(code), "[reserved_word,while][id,1][Relational_Op,!=][num,0]");

    t.end();
});

test('numeros de ponto flutuante (números reais)', t => {
    let tokenInstance = new TokenHandler();

    let code = "int x = 7.15 - 2.13;";

    t.equal(tokenInstance.generateTokens(code), "[reserved_word,int][id,1][Equal_Op,=][num,7.15][Arith_Op,-][num,2.13]");

    t.end();
});

test('remoção de espaços em branco e comentários', t => {
    let tokenInstance = new TokenHandler();

    let comment1 = "//Comentário 1";
    let comment2 = "/* Comentário 2 */";
    let comment3 = "int x = 0;/* */";
    let comment4 = "int x = 0; //teste";

    t.equal(tokenInstance.generateTokens(comment1), "");
    t.equal(tokenInstance.generateTokens(comment2), "");
    t.equal(tokenInstance.generateTokens(comment3), "[reserved_word,int][id,1][Equal_Op,=][num,0]");
    t.equal(tokenInstance.generateTokens(comment4), "[reserved_word,int][id,1][Equal_Op,=][num,0]");

    t.end();
});

test('strings', t => {
    let tokenInstance = new TokenHandler();

    let code = `String sexo = "masculino";`;
    let code2 = `String teste = "sexo masculino";`
    let code3 = `// " "`;

    t.equal(tokenInstance.generateTokens(code), '[reserved_word,String][id,1][Equal_Op,=][string_literal,masculino]');
    t.equal(tokenInstance.generateTokens(code3), '');

    t.end();
});

test('operadores lógicos', t => {
    let tokenInstance = new TokenHandler();

    let code = `if(idade > 70 && sexo == "masculino")`;

    t.equal(tokenInstance.generateTokens(code), `[reserved_word,if][id,1][Relational_Op,>][num,70][logic_op,&&][id,2][Relational_Op,==][string_literal,masculino]`);

    t.end();
});