// const util = require("./util.js");
// const types = require("../data/types.js");
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

// function func(list, name, returnType) {
	// if(list.next()?.value !== "(") throw "bad function";
	// const args = [];
	// while(list.peek()?.value !== ")") {
		// args.push(declareSingle(list));
		// if(list.peek()?.value !== ",") break;
		// list.next();
	// }
	// list.next();
	// return { type: "function", name, args, returnType };
// }
// 
// function declareMultiple(list) {
	// const declareType = list.next();
	// if(declareType.type !== "word") throw "bad type";
	// const declarations = [readDec(list)];
	// if(list.peek()?.value === "(") {
		// return func(list, declarations[0].name, declareType.value);
	// }
	// while(list.peek()?.value === ",") {
		// list.next();
		// declarations.push(readDec(list));
	// }
	// return declarations;
// }
// 
// function declareSingle(list) {
	// const declareType = list.next();
	// if(declareType.type !== "word") throw "bad type";
	// const declaration = readDec(list);
	// if(list.peek()?.value === "(") {
		// return func(list, declaration.name, declareType.value);
	// }
	// return { type: "declareSingle", declaration };
// }
// 
// function readDec(list) {
	// const name = list.next();
	// if(!name) throw "missing name";
	// if(name.type !== "word") throw "bad name";
// 
	// let value = null;
	// if(list.peek().value === "=") {
		// list.next();
		// value = readValue(list);
	// }
// 
	// return { name: name.value, value };
// }

function parseExpr(list, single = false) {
	const stack = [];
	const opStack = [];
	let unary = "pre";

	while(!list.done()) {
		const token = list.next();
		if(token.type === "word") {	
			stack.push(node("var", token.value));
			unary = "post";
		} else if(token.type === "number") {
			stack.push(node("number", token.value));
			unary = "post";
		} else if(token.value === "(") {
			if(stack.length > 0 && top(stack).type === "var") {
				opStack.push({ name: stack.pop().value, isFunc: true });
				stack.push({ type: "funcSep" });
			}
			opStack.push({ name: "(" });
			unary = "pre";
		} else if(token.value === ",") {
			if(single) break;
			while(opStack.length > 0 && top(opStack).name !== "(") popOp();
			unary = "pre";
		} else if(token.value === ")") {
			while(opStack.length > 0 && top(opStack).name !== "(") popOp();
			if(top(opStack).name === "(") opStack.pop();
			if(top(opStack).isFunc) {
				const op = opStack.pop();
				const args = [];
				while(stack.length > 0 && top(stack).type !== "funcSep") args.push(stack.pop());
				if(top(stack).type === "funcSep") stack.pop();
				stack.push(opNode(op, args));
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
		} else if(token.type === "stop") {
			break;
		} else {
			throw "what even is this";
		}
	}
	
	while(opStack.length > 0) popOp();
	return stack;

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
		const args = numArgs(op.type);
		if(args > stack.length) throw "not enough args";
		stack.push(opNode(op.internal ?? op.name, stack.splice(-args, args)));
	}
}

function generate(tokens) {
	const parts = [];
	while(!tokens.done()) {
		// tokens.peek()
		parts.push(...parseExpr(tokens));
	}
	// console.log(util.isPointless(parts[0]));
	return parts;
}

module.exports = generate;
