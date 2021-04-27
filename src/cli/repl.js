const tokenize = require("../core/tokenize.js");
const gentree = require("../core/tree.js");
const interpret = require("../core/interpret.js");
const util = require("../core/util.js");
const { Memory } = require("../data/memory.js");
const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "λ ",
	// prompt: "now what? ",
});

const memory = new Memory();
const ctx = new util.Context(memory);

function main(code) {
	try {
		const tokens = util.removeComments(tokenize(new util.Generator(code)));
		const gen = gentree(new util.Generator(tokens));
		// console.log(gen);
		// util.simplify(gen);
		console.log(util.format(interpret(gen, ctx)));
	} catch(err) {
		console.error(err);
	}
	rl.prompt();
}

rl.prompt();
rl.on("line", main);
