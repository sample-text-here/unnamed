// operators
const ops = [
	// assignments
	{
		name: "=",
		order: 1,
		type: "binaryRTL",
	}, {
		name: "+=",
		order: 1,
		type: "binaryRTL",
	}, {
		name: "-=",
		order: 1,
		type: "binaryRTL",
	}, {
		name: "*=",
		order: 1,
		type: "binaryRTL",
	}, {
		name: "/=",
		order: 1,
		type: "binaryRTL",
	}, {
		name: "**=",
		order: 1,
		type: "binaryRTL",
	}, {
		name: "%=",
		order: 1,
		type: "binaryRTL",
	}, {
		name: "&=",
		order: 1,
		type: "binaryRTL",
	}, {
		name: "|=",
		order: 1,
		type: "binaryRTL",
	}, {
		name: "^=",
		order: 1,
		type: "binaryRTL",
	}, {
		name: "||=",
		order: 1,
		type: "binaryRTL",
	}, {
		name: "&&=",
		order: 1,
		type: "binaryRTL",
	},
	// ternery
	// how???
	// {
		// name: "?",
		// order: 2,
		// type: "binary",
	// }, {
		// name: ":",
		// order: 2,
		// type: "binary",
	// },
	// logical
	{
		name: "||",
		order: 2,
		type: "binary",
	}, {
		name: "&&",
		order: 3,
		type: "binary",
	},
	// binary
	{
		name: "|",
		order: 4,
		type: "binary",
	}, {
		name: "^",
		order: 5,
		type: "binary",
	}, {
		name: "&",
		order: 6,
		type: "binary",
	},
	// comparison
	{
		name: "==",
		order: 6,
		type: "binary",
	}, {
		name: "!=",
		order: 6,
		type: "binary",
	}, {
		name: "<",
		order: 7,
		type: "binary",
	}, {
		name: ">",
		order: 7,
		type: "binary",
	}, {
		name: ">=",
		order: 7,
		type: "binary",
	}, {
		name: "<=",
		order: 7,
		type: "binary",
	},
	// bitshift
	{
		name: "<<",
		order: 8,
		type: "binary",
	}, {
		name: ">>",
		order: 8,
		type: "binary",
	},
	// basic math
	{
		name: "+",
		order: 9,
		type: "binary",
	}, {
		name: "-",
		order: 9,
		type: "binary",
	}, {
		name: "*",
		order: 10,
		type: "binary",
	}, {
		name: "/",
		order: 10,
		type: "binary",
	}, {
		name: "%",
		order: 10,
		type: "binary",
	}, {
		name: "**",
		order: 11,
		type: "binary",
	},
	// unary + misc
	{
		name: "!",
		order: 12,
		type: "unaryPre",
	}, {
		name: "~",
		order: 12,
		type: "unaryPre",
	}, {
		name: "-",
		order: 12,
		type: "unaryPre",
	}, {
		name: "++",
		internal: "incrPre",
		order: 13,
		type: "unaryPre",
	}, {
		name: "++",
		internal: "incrPost",
		order: 13,
		type: "unaryPost",
	}, {
		name: "--",
		internal: "decrPre",
		order: 13,
		type: "unaryPre",
	}, {
		name: "--",
		internal: "decrPost",
		order: 13,
		type: "unaryPost",
	}, {
		name: ".",
		order: 14,
		type: "binary",
	},
];

// basic calculations with values
const calc = {
	"||": (a, b) => a || b,
	"&&": (a, b) => a && b,
	"|": (a, b) => a | b,
	"^": (a, b) => a ^ b,
	"&": (a, b) => a & b,
	"+": (a, b) => a + b,
	"*": (a, b) => a * b,
	"/": (a, b) => a / b,
	"%": (a, b) => a % b,
	"**": (a, b) => a ** b,
	"==": (a, b) => a === b,
	"!=": (a, b) => a !== b,
	"<": (a, b) => a < b,
	">": (a, b) => a > b,
	"<=": (a, b) => a <= b,
	">=": (a, b) => a >= b,
	"<<": (a, b) => a << b,
	">>": (a, b) => a >> b,
	"!": (a) => !a,
	"~": (a) => ~a,
	"-": (...args) => args.length === 1 ? -args[0] : args[0] - args[1],
};

// helpers for calcRaw
function getVal(node) {
	if(!node) return null;
	if(node.type === "var") return node.variable.read();
	return node.value;
}

function change(func) {
	return function(a, b) {
		if(a.type !== "var") throw "invalid left hand side";
		const val = b ? func(getVal(a), getVal(b)) : func(getVal(a));
		a.variable.write(val);
		return val;
	}
}

// operators which modify variables
const calcRaw = {
	"=": change((a, b) => b),
	"+=": change((a, b) => a + b),
	"-=": change((a, b) => a - b),
	"*=": change((a, b) => a * b),
	"/=": change((a, b) => a / b),
	"**=": change((a, b) => a ** b),
	"%=": change((a, b) => a % b),
	"&=": change((a, b) => a & b),
	"^=": change((a, b) => a ^ b),
	"|=": change((a, b) => a | b),
	"&&=": change((a, b) => a && b),
	"||=": change((a, b) => a || b),
	"incrPre": change((a) => a + 1),
	"decrPre": change((a) => a + 1),
	"incrPost": (a) => {
		const val = getVal(a);
		a.variable.write(val + 1);
		return val;
	},
	"decrPost": (a) => {
		const val = getVal(a);
		a.variable.write(val - 1);
		return val;
	},
};

// operators which do stuff by themselves
// eg. x++ will modify x, but x + 1 wont
const usefulIfSingle = [
	"++",	"--",	"=",	"+=",	"-=",
	"*=",	"/=",	"**=",	"%=",	"&=",
	"|=",	"^=",	"||=",	"&&="
];

module.exports = { ops, calc, calcRaw, usefulIfSingle };
