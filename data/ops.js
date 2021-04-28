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

// helpers for advcalc
function getVar(ctx, node) {
	if(node.type !== "var") throw "cant increment literal";
	return ctx.get(node.value);
}

function changeVar(ctx, node, func) {
	const variable = getVar(ctx, node);
	const val = func(variable.read());
	variable.write(val);
	return val;
}

// operators which modify variables
const advcalc = {
	"=": (ctx, a, b) => changeVar(ctx, a, () => b.value),
	"+=": (ctx, a, b) => changeVar(ctx, a, n => n + b.value),
	"-=": (ctx, a, b) => changeVar(ctx, a, n => n - b.value),
	"*=": (ctx, a, b) => changeVar(ctx, a, n => n * b.value),
	"/=": (ctx, a, b) => changeVar(ctx, a, n => n / b.value),
	"**=": (ctx, a, b) => changeVar(ctx, a, n => n ** b.value),
	"%=": (ctx, a, b) => changeVar(ctx, a, n => n % b.value),
	"&=": (ctx, a, b) => changeVar(ctx, a, n => n & b.value),
	"^=": (ctx, a, b) => changeVar(ctx, a, n => n ^ b.value),
	"|=": (ctx, a, b) => changeVar(ctx, a, n => n | b.value),
	"&&=": (ctx, a, b) => changeVar(ctx, a, n => n && b.value),
	"||=": (ctx, a, b) => changeVar(ctx, a, n => n || b.value),
	"incrPre": (ctx, a) => changeVar(ctx, a, n => n || 1),
	"decrPre": (ctx, a) => changeVar(ctx, a, n => n || 1),
	"incrPost": (ctx, a) => {
		const variable = getVar(ctx, a);
		const val = variable.read();
		variable.write(val + 1);
		return val;
	},
	"decrPost": (ctx, a) => {
		const variable = getVar(ctx, a);
		const val = variable.read();
		variable.write(val - 1);
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

module.exports = { ops, calc, advcalc, usefulIfSingle };
