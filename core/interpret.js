// interpret the AST
const ops = require("../data/ops.js");
const funcs = require("../data/funcs.js");
const types = require("../data/types.js");
const { Memory, Variable, Arrayy } = require("../data/memory.js");
const { Context, pack } = require("./util.js");

function declareVariable(ctx, node) {
	const type = types.get(node.varType);
	for(let i of node.declarations) {
		if(i.array) {
			const mapped = i.array.map(i => toValue(ctx, i));
			let arrType = type;
			for(let i of mapped) arrType = new Arrayy(arrType, i);
			ctx.alloc(i.name, arrType);
		} else {
			ctx.alloc(i.name, type);
		}
		if(i.init) {
			calcOperator(ctx, i.init);
		}
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
	tmp.dispose();
	return null;
}

function calcFor(ctx, node) {
	const tmp = new Context(ctx);
	for(calc(tmp, node.init); toValue(tmp, node.cond); calc(tmp, node.incr)) {
		calc(tmp, node.body);
	}
	tmp.dispose();
	return null;
}

function calcFunction(ctx, node) {
	if(!funcs.hasOwnProperty(node.name)) throw "unknown function";
	const args = node.args.map(i => toValue(ctx, i));
	return pack(funcs[node.name](...args));
}

function calcAccess(ctx, node) {
	const path = node.path.map(i => toValue(ctx, i));
	let what = getWhat();
	for(let i of path) {
		if(what instanceof Variable) {
			what = what.read()[i];
		} else {
			what = what[i];
		}
	}
	if(what === null || what === undefined) throw "no";
	return { type: "var", variable: what };

	function getWhat() {
		const res = calc(ctx, node.what);
		if(res.type === "var") return res.variable;
		return toValue(ctx, res);
	}
}

function calcOperator(ctx, node) {
	if(ops.calc.hasOwnProperty(node.op)) {
		const args = node.args.map(i => toValue(ctx, i));
		return pack(ops.calc[node.op](...args));
	} else if(ops.calcRaw.hasOwnProperty(node.op)) {
		const args = node.args.map(i => calc(ctx, i));
		return pack(ops.calcRaw[node.op](...args));
	} else {
		throw "unimplemented op " + node.op;
	}
}

// reduce a node
function calc(ctx, node) {
	switch(node.type) {
		case "op": return calcOperator(ctx, node);
		case "function": return calcFunction(ctx, node);
		case "block": return interpret(node.content, ctx, false);
		case "access":  return calcAccess(ctx, node);
		case "declareVariable": return declareVariable(ctx, node);
	}
	switch(node.value) {
		case "if": return calcIf(ctx, node);
		case "while": return calcWhile(ctx, node);
		case "for": return calcFor(ctx, node);
	}
	if(node.type === "var" && !node.variable) {
		return {
			type: "var",
			variable: ctx.get(node.value),
		};
	}
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
		case "array": return node.values.map(i => toValue(ctx, i))
		case "op": return toValue(ctx, calcOperator(ctx, node));
		case "access": return toValue(ctx, calcAccess(ctx, node));
		case "function": return toValue(ctx, calcFunction(ctx, node));
		case "block": return interpret(node.content, ctx, false);
		case "if": return calcIf(ctx, node);
		case "while": return calcWhile(ctx, node);
		case "for": return calcFor(ctx, node);
		case "var": return readVar(node.variable || ctx.get(node.value));
	}
	throw "idk how to read that";

	function readVar(variable) {
		const read = variable.read();
		if(read instanceof Array) return read.map(readVar);
		return read;
	}
}

function interpret(nodes, ctx, base = true) {
	let res = null;
	for(let i of nodes) {
		if(i.type === "block") {
			const tmp = new Context(ctx);
			res = interpret(i.content, tmp, false);
			tmp.dispose();
		} else {
			res = calc(ctx, i);
		}
	}
	if(base) return toValue(ctx, res);
	return res;
}

module.exports = interpret;
