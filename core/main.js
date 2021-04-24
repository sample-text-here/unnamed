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
	console.log("optimized:", gen);
}

main("1+1,2+2");
// main("sin(1)");
