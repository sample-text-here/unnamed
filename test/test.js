const fs = require("fs");
const path = require("path");
const tokenize = require("../core/tokenize.js");
const gentree = require("../core/tree.js");
const interpret = require("../core/interpret.js");
const util = require("../core/util.js");
const { Memory } = require("../data/memory.js");

function test(code) {
	const memory = new Memory();
	const ctx = new util.Context(memory);
	const tokens = util.removeComments(tokenize(new util.Generator(code)));
	const gen = gentree(new util.Generator(tokens));
	interpret(gen, ctx);
}

fs.readdirSync("test").forEach(file => {
	if(path.extname(file)) return;
	try {
		test(fs.readFileSync("test/" + file, "utf8"));
		console.error(`${file} passed!`);
	} catch(err) {
		console.error(`${file} failed!\n${err}`);
	}
});
