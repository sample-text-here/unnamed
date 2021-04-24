const ops = require("./ops.js");
const top = arr => arr[arr.length - 1];
const dataToken = (type, value) => ({ type, value });
const opToken = (op, args) => ({ op, args });

function numArgs(type) {
	if(type.startsWith("unary")) return 1;
	if(type.startsWith("binary")) return 2;
	if(type.startsWith("ternary")) return 3;
	return 0;
}

function RPN(list) {
	const stack = [];
	const opStack = [];
	let unary = "pre";

	while(true) {
		const token = list.next();
		if(!token) break;
		if(token.type === "word") {	
			stack.push(dataToken("var", token.value));
			unary = "post";
		} else if(token.type === "number") {
			stack.push(dataToken("number", token.value));
			unary = "post";
		} else if(token.value === "(") {
			if(stack.length > 0 && top(stack).type === "var") {
				opStack.push({ name: stack.pop().value, isFunc: true });
				stack.push({ type: "funcSep" });
			}
			opStack.push({ name: "(" });
			unary = "pre";
		} else if(token.value === ",") {
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
				stack.push(opToken(op, args));
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
		} else {
			throw "what even is this";
		};
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
		stack.push(opToken(op.internal ?? op.name, stack.splice(-args, args)));
	}
}

module.exports = RPN;

// const tokens = require("./tokenize.js")("max(5, 4)");
// const gen = {
	// i: 0,
	// next: () => tokens[gen.i++],
	// peek: () => tokens[gen.i],
// };
// 
// console.log(require("util").inspect(RPN(gen), false, 8, true));
