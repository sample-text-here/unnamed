const tokenize = require("./tokenize.js");
const defaultTypes = ["int", "long", "float", "double"];

function func(list, name, returnType) {
	if(list.next()?.value !== "(") throw "bad function";
	const args = [];
	while(list.peek()?.value !== ")") {
		args.push(declareSingle(list));
		if(list.peek()?.value !== ",") break;
		list.next();
	}
	list.next();
	return { type: "function", name, args, returnType };
}

function declareMultiple(list) {
	const declareType = list.next();
	if(declareType.type !== "word") throw "bad type";
	const declarations = [readDec(list)];
	if(list.peek()?.value === "(") {
		return func(list, declarations[0].name, declareType.value); 
	}
	while(list.peek()?.value === ",") {
		list.next();
		declarations.push(readDec(list));
	}
	return declarations;
}

function declareSingle(list) {
	const declareType = list.next();
	if(declareType.type !== "word") throw "bad type";
	const declaration = readDec(list);
	// if(list.peek()?.value === "(") {
		// return func(list, declaration.name, declareType.value);
	// }
	return { type: "declareSingle", declaration };
}

function readDec(list) {
	const name = list.next();
	if(!name) throw "missing name";
	if(name.type !== "word") throw "bad name";

	let value = null;
	if(list.peek().value === "=") {
		list.next();
		value = readValue(list);
	}

	return { name: name.value, value };
}

function readValue(list) {
	const next = list.next();
	if(next.type === "string" || next.type === "number") return next;
	// if(next.value === "[") {
		// const list = [];
		// readValue();
		// return list;
	// }
	return null;
}

function generate(tokens) {
	const list = {
		i: 0,
		next: () => tokens[list.i++],
		peek: () => tokens[list.i],
	};
	// return declareMultiple(list);
	return readValue(list);
}

function main() {
	// const eq = "int x = 3, y = 5";
	// const eq = "int x(int y, int z) {}";
	// const eq = "int x = 5;";
	const eq = "3 + 5 * 4";
	// const eq = "3 >= 5";
	const tokens = tokenize(eq);
	const gen = generate(tokens);
	console.log("input:", eq);
	console.log("tokens:", tokens);
	console.log("tree:", gen);
}

main();
