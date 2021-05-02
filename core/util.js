// useful utilities
const EventEmmitter = require("events");
const { color } = require("../data/color.js");
const { usefulIfSingle } = require("../data/ops.js");
const { Variable } = require("../data/memory.js");

// iterate over an array and keep its index
class Generator {
	constructor(iter) {
		this.data = iter;
		this.i = 0;
	}

	next() { return this.data[this.i++] }
	peek() { return this.data[this.i] }
	done() { return this.i >= this.data.length }
}

// contexts attempt to write to their own memory before their parent's
class Context {
	constructor(parent) {
		if(parent instanceof Context) {
			this.parent = parent;
			this.memory = parent.memory;
			this.memory.save();
		} else {
			this.memory = parent;
		}
		this.allocs = new Map();
	}

	alloc(name, type) {
		if(this.allocs.has(name)) throw "already exists";
		const variable = new Variable(this.memory.alloc(type.size), type);
		this.allocs.set(name, variable);
	}
	
	get(name) {
		if(this.allocs.has(name)) {
			return this.allocs.get(name);
		} else if(this.parent) {
			return this.parent.get(name);
		} else {
			throw "unknown variable " + name;
		}
	}

	dispose() { this.memory.restore() }
}

// strip comments from a token list
function removeComments(tokens) {
	const clean = [];
	for(let i of tokens) if(i.type !== "comment") clean.push(i);
	return clean;
}

// is a node pointless/do nothing?
function isPointless(node) {
	if(node.type === "number") return true;
	if(node.type === "var") return true;
	if(node.type === "block" && node.content.length === 0) return true;
	if(node.type === "op") {
		if(!usefulIfSingle.includes(node.name)) return true;
	}
	return false;
}

// convert a raw value into one usable in the interpreter
function pack(value) {
	if(value === null) return { type: "null" };
	switch(typeof value) {
		case "number": return { type: "number", value };
		case "string": return { type: "number", value };
		case "boolean": return { type: "boolean", value };
	};
}

// color some text
function format(value) {
	if(value === null) {
		return color("null", "gray");
	} else if(typeof value === "number") {
		return color(value.toString(), "cyan");
	} else if(typeof value === "string") {
		return color(value, "green");
	} else if(typeof value === "boolean") {
		return color(value, "yellow");
	} else if(value instanceof Array) {
		const str = value.map(i => format(i)).join(", ");
		return `[${str}]`;
	} else {
		return value;
	}
}

module.exports = {
	Generator,
	Context,
	format,
	pack,
	removeComments,
	isPointless,
	events: new EventEmmitter(),
};
