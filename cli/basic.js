const fs = require("fs");
const { color } = require("../data/color.js");
const tokenize = require("../core/tokenize.js");
const gentree = require("../core/tree.js");
const util = require("../core/util.js");
const { Memory } = require("../data/memory.js");
const interpret = require("../core/interpret.js");
const readline = require("readline");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "λ ",
});

function error(why) {
	console.error(color(why, "red"));
	process.exit(1);
}

function read(file) {
	if(!file) error("no file");
	if(!fs.existsSync(file)) error("file does not exist");
	if(fs.lstatSync(file).isDirectory()) error("cannot read folder");
	try {
		return fs.readFileSync(file, "utf8");
	} catch {
		error("cannot read file");
	}
}

const memory = new Memory();
const ctx = new util.Context(memory);

function repl(code) {
	try {
		const tokens = util.removeComments(tokenize(new util.Generator(code)));
		const gen = gentree(new util.Generator(tokens));
		console.log(util.format(interpret(gen, ctx)));
	} catch(err) {
		console.error(err);
	}
	rl.prompt();
}

if(process.argv[2]) {
	const code = new util.Generator(read(process.argv[2]));
	const tokens = util.removeComments(tokenize(code));
	const gen = gentree(new util.Generator(tokens));
	interpret(gen, ctx);
	process.exit(0)
} else {
	rl.prompt();
	rl.on("line", repl);
}
