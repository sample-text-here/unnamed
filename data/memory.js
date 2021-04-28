// memory and data storage
// the main memory class
class Memory {
	constructor(size = 4096) {
		this.offset = 0;
		this.size = size;
		this.buffer = Buffer.alloc(size);
		
		this.allocs = new Map();
		this.frames = [];
	}

	alloc(size) {
		const start = this.offset;
		this.offset += size;
		if(this.offset > this.size) throw "out of memory!";
		const slice = this.buffer.slice(start, this.offset);
		slice.fill(0);
		return slice;
	}

	save() { this.frames.push(this.offset) }
	restore() { this.offset = this.frames.pop() }
}

// basic structure for manipulating data
class Data {
	constructor() {
		this.memory = null;
	}

	init(memory) {
		if(this.memory !== null) throw "memory already allocated";
		this.memory = memory.alloc(this.size);
	}

	assertMemory() {
		if(this.memory === null) throw "no memory allocated";
	}
}

// structure for holding numbers
class Variable extends Data {
	constructor(type) {
		super();
		this.size = type.size;
		this.type = type;
	}
	
	read() {
		this.assertMemory();
		return this.memory["read" + this.type.access]();
	}

	write(value) {
		this.assertMemory();
		this.memory["write" + this.type.access](value);
	}
}

// will reimplement when needed
// 100% legit array
// class Arrey {
	// constructor(type, length) {
		// this.type = type;
		// this.length = length;
		// this.memory = null;
	// }
// 
	// attach(memory) {
		// if(this.memory !== null) throw "memory already allocated";
		// this.memory = memory.alloc(this.type.size * this.length);
	// }
	// 
	// read(index) {
		// if(this.memory === null) throw "no memory allocated";
		// return this.memory["read" + this.type.access](this.type.size * index);
	// }
// 
	// write(index, value) {
		// if(this.memory === null) throw "no memory allocated";
		// this.memory["write" + this.type.access](value, this.type.size * index);
	// }
// }

// class Struct {
	// constructor() {
		// this.parts = new Map();
		// this.size = 0;
		// this.memory = null;
	// }
// 
	// attatch(memory) {
		// if(this.memory !== null) throw "memory already allocated";
		// this.memory = memory.alloc(this.size);
	// }
// 
	// add(name, type) {
		// if(this.ptr !== null) throw "memory already allocated";
		// if(this.parts.has(name)) throw name + " already exists on struct";
		// this.parts.set(name, { offset: this.size, type });
		// this.size += type.size;
	// }
// 
	// get(name) {
		// if(!this.parts.has(name)) throw name + " doesnt exist on struct";
		// return this.parts.get(name);
	// }
// 
	// read(name) {
		// if(this.ptr === null) throw "no memory attached";
		// const { offset, type } = this.get(name);
		// return this.memory["read" + type.access](offset);
	// }
// 
	// write(name, value) {
		// if(this.ptr === null) throw "no memory attached";
		// const { offset, type } = this.get(name);
		// this.memory["write" + type.access](value, offset);
	// }
// }

// module.exports = { Memory, Variable, Arrey, Struct };
module.exports = { Memory, Variable };
