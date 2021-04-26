const tokenize = require("../core/tokenize.js");
const gentree = require("../core/tree.js");
const interpret = require("../core/interpret.js");
const util = require("../core/util.js");
const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "λ ", // i am now a :sunglasses: cool kid
	// prompt: "> ",
});

let i = 0;

function main(code) {
	try {
		const tokens = util.removeComments(tokenize(new util.Generator(code)));
		const gen = gentree(new util.Generator(tokens));
		// util.simplify(gen);
		console.log(util.format(interpret(gen)));
	} catch(err) {
		console.error(err);
	}
	rl.prompt();
}

rl.prompt();
rl.on("line", main);
