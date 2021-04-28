const ops = require("../data/ops.js");
const funcs = require("../data/funcs.js");
const types = require("../data/types.js");
const { Memory, Variable, Arrey } = require("../data/memory.js");
const { Context, pack } = require("./util.js");

// get new variable declarations
function getNames(nodes) {
	const names = [];
	for(let i of nodes) {
		if(i.type === "var") {
			names.push(i.value);
		} else if(i.type === "op") {
			names.push(...getNames(i.args));
		}
	}
	return names;
}

function declareVariable(ctx, node) {
	for(let name of getNames(node.declarations)) {
		ctx.alloc(name, new Variable(types.get(node.varType)));
	}

	for(let i of node.declarations) {
		if(i.type === "op") calcOperator(ctx, i);
	}
	
	return pack(null);
}

function calcIf(ctx, node) {
	if(toValue(ctx, node.condition)) {
		return toValue(ctx, node.body);
	} else if(node.else) {
		return toValue(ctx, node.else);
	}
	return null;
}

function calcWhile(ctx, node) {
	const tmp = new Context(ctx);
	while(toValue(tmp, node.condition)) calc(tmp, node.body);
	return null;
}

function calcFor(ctx, node) {
	const tmp = new Context(ctx);
	for(calc(tmp, node.init); toValue(tmp, node.cond); calc(tmp, node.incr)) {
		calc(tmp, node.body);
	}
	return null;
}

function calcFunction(ctx, node) {
	if(!funcs.hasOwnProperty(node.name)) throw "unknown function";
	const args = node.args.map(i => toValue(ctx, calc(ctx, i)));
	return pack(funcs[node.name](...args));
}

function calcOperator(ctx, node) {
	if(ops.calc.hasOwnProperty(node.op)) {
		const args = node.args.map(i => toValue(ctx, i));
		return pack(ops.calc[node.op](...args));
	} else if(ops.advcalc.hasOwnProperty(node.op)) {
		const args = node.args.map(i => calc(ctx, i));
		return pack(ops.advcalc[node.op](ctx, ...args));
	} else {
		throw "unimplemented op " + node.op;
	}
}

// reduce a node
function calc(ctx, node) {
	if(node.type === "op") return calcOperator(ctx, node);
	if(node.type === "function") return calcFunction(ctx, node);
	if(node.type === "declareVariable") return declareVariable(ctx, node);
	if(node.value === "if") return calcIf(ctx, node);
	if(node.value === "while") return calcWhile(ctx, node);
	if(node.value === "for") return calcFor(ctx, node);
	// if(node.type === "declareFunction") return declareFunction(ctx, node);
	return node;
}

// convert to a raw value
function toValue(ctx, node) {
	if(node === null) return null;
	switch(node.type) {
		case "null": return null;
		case "number":
		case "string":
		case "boolean": return node.value;
		case "var": return ctx.get(node.value).read();
		case "op": return toValue(ctx, calcOperator(ctx, node));
		case "function": return toValue(ctx, calcFunction(ctx, node));
		case "block": return interpret(node.content, ctx, false);
		case "if": return calcIf(ctx, node);
		case "while": return calcWhile(ctx, node);
		case "for": return calcFor(ctx, node);
		// case "array": // TODO
	}
	throw "idk how to read that";
}

function interpret(nodes, ctx, base = true) {
	let res = null;
	for(let i of nodes) {
		if(i.type === "block") {
			res = interpret(i.content, new Context(ctx), false);
		} else {
			res = calc(ctx, i);
		}
	}
	if(base) return toValue(ctx, res);
	return res;
}

module.exports = interpret;
