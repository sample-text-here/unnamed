const { calc } = require("../data/ops.js");

function simplify(tree) {
	for(let i of tree) {
		if(i.type === "block") {
			simplify(i.content);
		} else if(i.type === "op") {
			reduceNode(i);
		} else if(i.type === "declaration") {
			i.expressions.forEach(reduceNode);
		}
	}
}

function reduceNode(node) {
	let canReduce = true;
	for(let i of node.args) {
		if(i.type === "op") {
			reduceNode(i);
			if(i.type === "op") canReduce = false;
		} else if(i.type !== "number") {
			canReduce = false;
		}
	}
	toBitshift(node);
	if(!canReduce) return;
	if(calc.hasOwnProperty(node.op)) {
		node.type = "number";
		node.value = calc[node.op](...node.args.map(i => i.value));
		delete node.args;
		delete node.op;
	}
}

function toBitshift(node) {
	if(node.type !== "op") return;
	if(node.args[1].type !== "number") return;
	// if(node.op !== "/" && node.op !== "*") return;
	if(node.op !== "*") return;
	const shift = Math.log2(node.args[1].value);
	if(!Number.isInteger(shift)) return;
	// node.op = node.op === "/" ? ">>" : "<<";
	node.op = "<<";
	node.args[1].value = shift;
}
