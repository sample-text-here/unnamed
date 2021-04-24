const { calc, usefulIfSingle } = require("../data/ops.js");

class Generator {
	constructor(iter) {
		this.data = iter;
		this.i = 0;
	}

	next() { return this.data[this.i++] }
	peek() { return this.data[this.i] }
	done() { return this.i >= this.data.length }
}

function removeComments(tokens) {
	const clean = [];
	for(let i of tokens) {
		if(i.type !== "comment") clean.push(i);
	}
	return clean;
}

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
		if(!canReduce) return;
		if(calc.hasOwnProperty(node.op)) {
			node.type = "number";
			node.value = calc[node.op](...node.args.map(i => i.value));
			delete node.args;
			delete node.op;
		}
	}
}

function isPointless(node) {
	if(node.type === "number") return true;
	if(node.type === "var") return true;
	if(node.type === "op") {
		if(!usefulIfSingle.includes(node.name)) return true;
	}
	return false;
}

module.exports = { Generator, removeComments, simplify, isPointless };
