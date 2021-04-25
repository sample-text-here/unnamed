const funcs = require("../data/funcs.js");

function interpret(tree) {
	for(let i of tree) {
		if(i.type === "function") {
			if(!funcs.hasOwnProperty(i.name)) {
				throw "unknown function " + i.name;
			}
			funcs[i.name](...i.args);
			// console.log(i);
		} else {
			throw "what is this";
		}
	}
}

/*
[
  {
    type: 'function',
    name: 'print',
    args: [ { type: 'number', value: 12 } ]
  }
]
*/

module.exports = interpret;
