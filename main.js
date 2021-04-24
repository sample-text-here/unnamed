const tokenize = require("./tokenize.js");
const gentree = require("./tree.js");
const util = require("./util.js");

function main() {
	const tokens = tokenize(eq);
	const gen = generate(tokens);
	console.log("input:", eq);
	console.log("tokens:", tokens);
	console.log("tree:", gen);
}

main("3 + 5 * 4");
