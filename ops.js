module.exports = [
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
		name: ".",
		order: 14,
		type: "binary",
	},
];
