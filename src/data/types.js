const types = new Map();
const baseTypes = {
	"u8": "UInt8",
	"u16": "UInt16",
	"u32": "UInt32",
	"u64": "UInt64",

	"i8": "Int8",
	"i16": "Int16",
	"i32": "Int32",
	"i64": "Int64",
	
	"f32": "Float32",
	"f64": "Double64",
};

for(let type in baseTypes) {
	const size = parseInt(type.slice(1));
	types.set(type, { size, access: baseTypes[type] + "BE" })
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
