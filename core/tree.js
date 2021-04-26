const { Generator, isPointless, events } = require("./util.js");
const { ops } = require("../data/ops.js");
const top = arr => arr[arr.length - 1];
const node = (type, value) => ({ type, value });
const opNode = (op, args) => ({ type: "op", op, args });

function numArgs(type) {
	if(type.startsWith("unary")) return 1;
	if(type.startsWith("binary")) return 2;
	if(type.startsWith("ternary")) return 3;
	return 0;
}

function parseExpr(list, single = false) {
	const stack = [];
	const opStack = [];
	let unary = "pre";
	let seperated = true;

	while(!list.done()) {
		const token = list.next();
		if(token.type === "word") {	
			if(!seperated && top(stack).type === "var") {
				top(stack).type = "keyword";
			}
			stack.push(node("var", token.value));
			unary = "post";
			seperated = false;
		} else if(token.value === "(") {
			if(stack.length > 0 && top(stack).type === "var" && !seperated) {
				opStack.push({ name: stack.pop().value, isFunc: true });
				stack.push({ type: "funcSep" });
			}
			opStack.push({ name: "(" });
			unary = "pre";
		} else if(token.type === "number" || token.type === "string") {
			stack.push(node("number", token.value));
			unary = "post";
		}  else if(token.value === ",") {
			if(single) break;
			while(opStack.length > 0 && top(opStack).name !== "(") popOp();
			stack.push({ type: "spacer" });
			unary = "pre";
		} else if(token.value === ")") {
			while(opStack.length > 0 && top(opStack).name !== "(") popOp();
			if(top(opStack).name === "(") opStack.pop();
			if(top(opStack).isFunc) {
				const op = opStack.pop();
				const args = [];				
				while(stack.length > 0 && top(stack).type !== "funcSep") {
					if(top(stack).type === "spacer") {
						stack.pop();
					} else {
						args.push(stack.pop());
					}
				}
				if(top(stack).type === "funcSep") stack.pop();
				stack.push({ type: "function", name: op.name, args });
			}
			unary = "pre";
		} else if(token.type === "symbol") {
			const thisOp = findOp(token.value);
			let prevOp = top(opStack);
			while(opStack.length > 0) {
				if(top(opStack).name === "(") break;
				if(prevOp.order < thisOp.order) break;
				if(prevOp.order === thisOp.order && prevOp.type !== "binaryRTL") break;
				popOp();
				prevOp = top(opStack);
			}
			opStack.push(thisOp);
			unary = "pre";
			seperated = true;
		} else if(token.type === "stop") {
			break;
		} else if(token.type === "block") {
			list.i--;
			break;
		} else {
			throw "what even is this";
		}
	}
	
	while(opStack.length > 0) popOp();
	return stack.filter(i => i.type !== "spacer");

	function findOp(op) {
		for(let i of ops) {
			if(i.name !== op) continue;
			const isUnary = i.type.startsWith("unary");
			if(isUnary) {
				const unaryType = i.type.endsWith("Pre") ? "pre" : "post";
				if(unary === unaryType) return i;
			} else {
				return i;
			}
		}
		throw "what even is a " + op;
	}

	function popOp() {
		const op = opStack.pop();
		const argCount = numArgs(op.type);
		if(argCount > stack.length) throw "not enough args";
		const args = [];
		for(let i = 0; i < argCount; i++) {
			if(top(stack).type === "spacer") throw "no";
			args.push(stack.pop());
		}
		stack.push(opNode(op.internal ?? op.name, args));
	}
}

function declarations(parsed) {
	const isFunc = node => node.type === "op" && node.op.isFunc;
	const transformed = [];
	while(!parsed.done()) {
		const part = parsed.peek();
		if(part.type === "keyword") {
			const type = readType();
			const read = isFunc(parsed.peek())
				? readFunc()
				: readVars();
			transformed.push({...type, ...read});
		} else if(part.type === "seperator") {
			parsed.next();
		} else {
			transformed.push(parsed.next());
		}
	}
	return transformed;

	function readType() {
		const modifiers = [];
		let varType = parsed.next().value;
		while(!parsed.done() && parsed.peek().type === "keyword") {
			modifiers.push(type);
			varType = parsed.next().value;
		}
		return { modifiers, varType };
	}

	function readFunc() {
		const next = parsed.next();
		return {
			name: next.op.name,
			args: declarations(new Generator(next.args.reverse())),
			type: "declareFunction",
		};
	}

	function readVars() {
		const vars = [];
		const names = [];
		while(!parsed.done()) {
			const next = parsed.peek();
			if(next.type !== "var" && next.type !== "op") break;
			if(next.type === "op" && next.op.isFunc) throw "why would this work";
			vars.push(parsed.next());
		}
		return { vars, names, type: "declareVariable" };
	}
}

function generate(tokens) {
	const parts = [];
	while(!tokens.done()) {
		parts.push(...parseExpr(tokens));
		parts.push({ type: "seperator" });
		const token = tokens.peek();
		if(!token) break;
		if(token.value === '{') {
			tokens.next();
			parts.push({ type: "block", content: generate(tokens) });
		} else if(token.value === '}') {
			break;
		}
	}
	const assembled = declarations(new Generator(parts));
	for(let i of assembled) {
		if(isPointless(i)) {
			events.emit("warn", { type: "poinless", gen: tokens });
		}
	}
	return assembled;
}

module.exports = generate;
