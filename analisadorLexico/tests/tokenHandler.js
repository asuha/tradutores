const test = require('tape');
const TokenHandler = require("./../src/models/TokenHandler");

test('variaveis e identificadores', t => {
    let tokenInstance = new TokenHandler();

    let code1 = "int x = 7;";
    let code2 = "int y;";

    t.equal(tokenInstance.generateTokens(code1), "[reserved_word,int][id,1][equal,=][num,7][semicolon,;]");
    t.equal(tokenInstance.generateTokens(code2), "[reserved_word,int][id,2][semicolon,;]");

    t.end();
});

test('constantes numéricas', t => {
    let tokenInstance = new TokenHandler();

    let code = "int x = 7 + 25 * 52;";

    t.equal(tokenInstance.generateTokens(code), "[reserved_word,int][id,1][equal,=][num,7][Arith_Op,+][num,25][Arith_Op,*][num,52][semicolon,;]");

    t.end();
});

test('palavras reservadas', t => {
    let tokenInstance = new TokenHandler();

    let code = "if( x == 10 )";
    t.equal(tokenInstance.generateTokens(code), "[reserved_word,if][l_paren,(][id,1][Relational_Op,==][num,10][r_paren,)]");

    t.end();
});

test('operadores relacionais', t => {
    let tokenInstance = new TokenHandler();

    let code = "while( x != 0)";

    t.equal(tokenInstance.generateTokens(code), "[reserved_word,while][l_paren,(][id,1][Relational_Op,!=][num,0][r_paren,)]");

    t.end();
});

test('numeros de ponto flutuante (números reais)', t => {
    let tokenInstance = new TokenHandler();

    let code = "int x = 7.15 - 2.13;";

    t.equal(tokenInstance.generateTokens(code), "[reserved_word,int][id,1][equal,=][num,7.15][Arith_Op,-][num,2.13][semicolon,;]");

    t.end();
});

test('remoção de espaços em branco e comentários', t => {
    let tokenInstance = new TokenHandler();

    let comment1 = "//Comentário 1";
    let comment2 = "/* Comentário 2 */";
    let comment3 = "int x = 0;/* */";
    let comment4 = "int x = 0; //teste";
    let comment5 = `/* teste oi ; , 
                    eu sou ele
                    teste som */`;

    t.equal(tokenInstance.generateTokens(comment1), "");
    t.equal(tokenInstance.generateTokens(comment2), "");
    t.equal(tokenInstance.generateTokens(comment3), "[reserved_word,int][id,1][equal,=][num,0][semicolon,;]");
    t.equal(tokenInstance.generateTokens(comment4), "[reserved_word,int][id,1][equal,=][num,0][semicolon,;]");
    t.equal(tokenInstance.generateTokens(comment5), "");

    t.end();
});

test('strings', t => {
    let tokenInstance = new TokenHandler();

    let code = `string sexo = "masculino";`;
    let code2 = `string teste = "sexo masculino";`
    let code3 = `// " "`;

    t.equal(tokenInstance.generateTokens(code), '[reserved_word,string][id,1][equal,=][string_literal,masculino][semicolon,;]');
    t.equal(tokenInstance.generateTokens(code2), '[reserved_word,string][id,2][equal,=][string_literal,sexo][string_literal,masculino][semicolon,;]')
    t.equal(tokenInstance.generateTokens(code3), '');

    t.end();
});

test('operadores lógicos', t => {
    let tokenInstance = new TokenHandler();

    let code = `if(idade > 70 && sexo == "masculino")`;

    t.equal(tokenInstance.generateTokens(code), `[reserved_word,if][l_paren,(][id,1][Relational_Op,>][num,70][logic_op,&&][id,2][Relational_Op,==][string_literal,masculino][r_paren,)]`);

    t.end();
});

test('parâmetro por referência', t => {
    let tokenInstance = new TokenHandler();

    let code = "int num = 1;"
    let code1 = `scanf ("%d",&num);`;

    t.equal(tokenInstance.generateTokens(code), `[reserved_word,int][id,1][equal,=][num,1][semicolon,;]`);
    t.equal(tokenInstance.generateTokens(code1), `[id,2][l_paren,(][string_literal,%d][comma,,][reference,&][id,1][r_paren,)][semicolon,;]`);

    t.end();
});

test('array declaration', t => {
    let tokenInstance = new TokenHandler();

    let code = "int v[] = {5, 10, 15, 3, 10, 76, 5, 13, 33, 45};"

    t.equal(tokenInstance.generateTokens(code), "[reserved_word,int][id,1][equal,=][l_bracket,{][num,5][comma,,][num,10][comma,,][num,15][comma,,][num,3][comma,,][num,10][comma,,][num,76][comma,,][num,5][comma,,][num,13][comma,,][num,33][comma,,][num,45][r_bracket,}][semicolon,;]");

    t.end()
})