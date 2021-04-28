// generate an AST from a list of tokens
const { Generator } = require("./util.js");
const { ops } = require("../data/ops.js");
const keywords = require("../data/keywords.js");

// utilities
const top = arr => arr[arr.length - 1];
const node = (type, value) => ({ type, value });
const opNode = (op, args) => ({ type: "op", op, args });

// get the number of arguments from an operator type
function numArgs(type) {
	if(type.startsWith("unary")) return 1;
	if(type.startsWith("binary")) return 2;
	if(type.startsWith("ternary")) return 3;
	return 0;
}

// the main generator; read an expression
function readExpression(list) {
	const stack = [];
	const opStack = [];
	let unary = "pre";
	let depth = 0;

	while(!list.done()) {
		const token = list.next();
		if(token.type === "word") {	
			if(unary === "post") throw "extra variable";
			stack.push(node("var", token.value));
			unary = "post";
		} else if(token.type === "number") {
			if(unary === "post") throw "extra number";
			stack.push(node("number", token.value));
			unary = "post";
		} else if(token.value === ",") {
			if(depth === 0) break;
			while(opStack.length > 0 && top(opStack).name !== "(") popOp();
			stack.push({ type: "spacer" });
			unary = "pre";
		} else if(token.value === "(") {
			if(stack.length > 0 && top(stack).type === "var") {
				opStack.push({ name: stack.pop().value, isFunc: true });
				stack.push({ type: "funcSep" });
			}
			opStack.push({ name: "(" });
			unary = "pre";
			depth++;
		} else if(token.value === ")") {
			while(opStack.length > 0 && top(opStack).name !== "(") popOp();
			if(top(opStack)?.name !== "(") throw "no closing paranthase";
			opStack.pop();
			if(top(opStack)?.isFunc) {
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
			depth--;
		}
		// else if(token.value === "[") {
			// stack.push({ type: "arraySep" });
			// unary = "pre";
		// } else if(token.value === "]") {
			// const values = [];
			// while(stack.length > 0 && top(stack).type !== "arraySep") {
				// while(top(stack).type === "spacer") stack.pop();
				// values.push(stack.pop());
			// }
			// if(top(stack).type !== "arraySep") throw "unterminated array";
			// stack.pop();
			// stack.push({ type: "array", values: values.reverse() });
			// unary = "post";
		// } 
		else if(token.type === "symbol") {
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
		if(op.isFunc) throw "invalid function use";
		const argCount = numArgs(op.type);
		if(argCount > stack.length) throw "not enough args";
		const args = [];
		for(let i = 0; i < argCount; i++) {
			if(top(stack).type === "spacer") throw "no";
			args.push(stack.pop());
		}
		stack.push(opNode(op.internal ?? op.name, args.reverse()));
	}
}

// read a keyword
function readKeyword(type, tokens) {
	if(type === "if") {
		
	} else if(type === "else") {
		
	}
	throw "unimplemented keyword " + type;
}

// read a variable declaration
function readVariable(tokens) {
	const modifiers = [];
	const declarations = [];
	let varType = tokens.next().value;
	let next = tokens.next().value;
	while(!tokens.done() && tokens.peek()?.type === "word") {
		modifiers.push(varType);
		varType = next;
		next = tokens.next().value;
	}
	tokens.i--;
	declarations.push(...readExpression(tokens));
	return { type: "declareVariable", modifiers, varType, declarations };
}

function readWord(word, tokens, parts) {
	if(keywords.includes(word)) {
		parts.push(readKeyword(word, tokens));
	} else if(tokens.peek()?.type === "word") {
		tokens.i--;
		parts.push(readVariable(tokens));
	} else {
		tokens.i--;
		parts.push(...readExpression(tokens));
	}
}

// generate an AST from a list of tokens
function generate(tokens) {
	const parts = [];
	while(!tokens.done()) {
		const token = tokens.next();
		if(token.value === '{') {
			parts.push({ type: "block", content: generate(tokens) });
		} else if(token.value === '}') {
			break;
		} else if(token.type === "word") {
			readWord(token.value, tokens, parts);
		} else {
			tokens.i--;
			parts.push(...readExpression(tokens));
		}
	}
	return parts;
}

module.exports = generate;