const ops = require("../data/ops.js");
const funcs = require("../data/funcs.js");

class Context {
	constructor(parent) {
		this.parent = parent;
		this.variables = new Map();
	}

	setVar(name, value, vartype) {
		this.vars.set(name, { ...value, vartype });
	}

	getVar(name) {
		if(!this.vars.has(name)) throw "unknown variable " + name;
		return this.vars.get(name);
	}
}

function calcFunc(ctx, node) {
	if(!funcs.hasOwnProperty(node.name)) throw "unknown function";
	return funcs[node.name](...node.args.map(i => calc(ctx, i)));
}

function calcOp(ctx, node) {
	if(ops.calc.hasOwnProperty(node.op)) {
		const args = node.args.map(i => calc(ctx, i));
		return ops.calc[node.op](...args);
	} else if(ops.advcalc.hasOwnProperty(node.op)) {
		const args = node.args.map(i => calc(ctx, i));
		return ops.advcalc[node.op](ctx, node.args);
	} else {
		throw "unimplemented op " + node.op;
	}
}

function calc(ctx, node) {
	if(node.type === "null") return null;
	if(node.type === "number") return node.value;
	if(node.type === "string") return node.value;
	if(node.type === "var") return ctx.getVar(node);
	if(node.type === "op") return calcOp(ctx, node);
	if(node.type === "function") return calcFunc(ctx, node);
	throw "idk how to read that";
}

function interpret(nodes, parent = null) {
	const ctx = new Context(parent);
	let res = null;
	for(let i of nodes) {
		res = calc(ctx, i);
	}
	return res;
}

module.exports = interpret;
