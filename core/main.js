const tokenize = require("./tokenize.js");
const gentree = require("./tree.js");
const util = require("./util.js");

function main(code) {
	console.log("input:", code);
	const tokens = util.removeComments(tokenize(new util.Generator(code)));
	console.log("tokens:", tokens);
	const gen = gentree(new util.Generator(tokens));
	console.log("tree:", require("util").inspect(gen, false, 8, true));
	util.simplify(gen);
	console.log("optimized:", require("util").inspect(gen, false, 8, true));
}

// main(`i32 a;`);
// main(`i32 a, b;`);
// main(`i32 a = 3, b = 5;`);
// main(`i32 foo();`);
main(`i32 add(i32 a, i32 b);`);
// main("sin(1)");
