const ops = require("../data/ops.js");
const funcs = require("../data/funcs.js");
const { Context } = require("./util.js");

function declareVariable(ctx, node) {
	ctx.curType = node.varType; 
	node.vars.forEach(i => {
		if(i.type === "var") {
			ctx.setVar(i.value, 0)
		} else {
			calcOp(ctx, i);
		}
	});
	return null;
}

function calcFunc(ctx, node) {
	if(!funcs.hasOwnProperty(node.name)) throw "unknown function";
	return funcs[node.name](...node.args.map(i => calc(ctx, i)));
}

function calcOp(ctx, node) {
	if(node.type !== "op") return node;
	if(ops.calc.hasOwnProperty(node.op)) {
		const args = node.args.map(i => calc(ctx, i));
		return ops.calc[node.op](...args);
	} else if(ops.advcalc.hasOwnProperty(node.op)) {
		const args = node.args.map(i => calcOp(ctx, i));
		return ops.advcalc[node.op](ctx, ...args);
	} else {
		throw "unimplemented op " + node.op;
	}
}

function calc(ctx, node) {
	if(node === null) return null;
	if(node.type === "null") return null;
	if(node.type === "number") return node.value;
	if(node.type === "string") return node.value;
	if(node.type === "var") return ctx.getVar(node.value).value;
	if(node.type === "op") return calcOp(ctx, node);
	if(node.type === "function") return calcFunc(ctx, node);
	if(node.type === "declareVariable") return declareVariable(ctx, node);
	throw "idk how to read that";
}

function interpret(nodes, context) {
	const ctx = context || new Context(null);
	let res = null;
	for(let i of nodes) {
		if(i.type === "block") {
			res = interpret(i.content, new Context(ctx));
		} else {
			res = calc(ctx, i);
			ctx.curType = null;
		}
	}
	return res;
}

module.exports = interpret;
