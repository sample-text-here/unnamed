const { color } = require("../data/color.js")

class Generator {
	constructor(iter) {
		this.data = iter;
		this.i = 0;
	}

	next() { return this.data[this.i++] }
	peek() { return this.data[this.i] }
	done() { return this.i >= this.data.length }
}

function getPos(gen) {
	const str = normalize(gen.data);
	let index = 0, row = 1, col = 1;
	
	if(gen.data instanceof Array) {
		for(let i = 0; i < gen.i; i++) index += gen.data[i].length;
	}
	
	for(let i = 0; i < index; i++) {
		col++;
		if(str[i] === '\n') {
			col = 1;
			row++;
		}
	}
	
	return [row, col];
}

function normalize(data) {
	return (data instanceof Array) ? data.join("") : data.toString();
}

function displayCurrent(gen) {
	const start = normalize(gen.data.slice(gen.i - 10, gen.i)).slice(-10);
	const main = normalize(gen.next());
	const end = normalize(gen.data.slice(gen.i, gen.i + 10)).slice(0, 10);
	const arrows = " ".repeat(start.length) + "^".repeat(main.length);
	const pos = getPos(gen).join(":");
	return `at ${pos}\n${start}${main}${end}\n${arrows}`;
}

function handleErr(gen) {
	const msg = `${color("error!", "red")}\n${displayCurrent(gen)}\n`;
	process.stderr.write(msg);
}

function handleWarn(gen) {
	const msg = `${color("warning!", "yellow")}\n${displayCurrent(gen)}\n`;
	process.stderr.write(msg);
}

module.exports = { Generator, handleErr, handleWarn };
