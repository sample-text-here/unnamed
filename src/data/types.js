const types = new Map();
const baseTypes = {
	"u8": "UInt8BE",
	"u16": "UInt16BE",
	"u32": "UInt32BE",
	"u64": "UInt64BE",

	"i8": "Int8BE",
	"i16": "Int16BE",
	"i32": "Int32BE",
	"i64": "Int64BE",
	
	"f32": "Float32BE",
	"f64": "Double64BE",
};

for(let type in baseTypes) {
	const size = parseInt(type.slice(1));
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
