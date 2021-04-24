const tokenize = require("./tokenize.js");
const gentree = require("./tree.js");
const util = require("./util.js");

function main(code) {
	const tokens = tokenize(new util.Generator(code));
	const gen = gentree(new util.Generator(tokens));
	console.log("input:", code);
	console.log("tokens:", tokens);
	console.log("tree:", gen);
}

main("2 + 4 * 3");
