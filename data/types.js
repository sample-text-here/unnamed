// builtin types
const types = new Map();
const baseTypes = {
	"u8": "UInt8",
	"u16": "UInt16BE",
	"u32": "UInt32BE",
	"u64": "UInt64BE",

	"i8": "Int8",
	"i16": "Int16BE",
	"i32": "Int32BE",
	"i64": "Int64BE",
	
	"f32": "FloatBE",
	"f64": "DoubleBE",
};

for(let type in baseTypes) {
	const size = parseInt(type.slice(1)) / 8;
	types.set(type, { size, access: baseTypes[type] })
}

const aliases = {
	"char": "i8",
	"byte": "i8",
	"short": "i16",
	"int": "i32",
	"long": "i64",
	"float": "f32",
	"double": "f64",
};

for(let type in aliases) {
	types.set(type, types.get(aliases[type]));
}

module.exports = types;
