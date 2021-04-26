const ops = require("../data/ops.js");
const funcs = require("../data/funcs.js");
const types = require("../data/types.js");
const { Memory, Variable, Arrey } = require("../data/memory.js");
const { Context, pack } = require("./util.js");

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
	for(let name of getNames(node.vars)) {
		ctx.alloc(name, new Variable(types.get(node.varType)));
	}

	for(let i of node.vars) {
		if(i.type === "op") calcOp(ctx, i);
	}
	
	return pack(null);
}

function calcFunc(ctx, node) {
	if(!funcs.hasOwnProperty(node.name)) throw "unknown function";
	return pack(funcs[node.name](...node.args.map(i => toValue(ctx, calc(ctx, i)))));
}

function calcOp(ctx, node) {
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

function calc(ctx, node) {
	if(node.type === "op") return calcOp(ctx, node);
	if(node.type === "declareVariable") return declareVariable(ctx, node);
	if(node.type === "function") return calcFunc(ctx, node);
	return node;
}

function toValue(ctx, node) {
	if(node === null) return null;
	if(node.type === "null") return null;
	if(node.type === "number") return node.value;
	if(node.type === "string") return node.value;
	if(node.type === "boolean") return node.value;
	if(node.type === "var") return ctx.get(node.value).read();
	if(node.type === "op") return toValue(ctx, calcOp(ctx, node));
	if(node.type === "function") return calcFunc(ctx, node);
	if(node.type === "array") return node.values.map(i => toValue(ctx, i));
	throw "idk how to read that";
}

function interpret(nodes, ctx) {
	let res = null;
	for(let i of nodes) {
		if(i.type === "block") {
			res = interpret(i.content, new Context(ctx));
		} else {
			res = calc(ctx, i);
		}
	}
	return toValue(ctx, res);
}

module.exports = interpret;
