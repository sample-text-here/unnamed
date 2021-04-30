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

// structure for holding numbers
class Variable {
	constructor(memory, type) {
		this.type = type;
		this.memory = memory.alloc(type.size);
	}

	read() {
		return this.type.read(this.memory);
	}

	write(val) {
		this.type.write(this.memory, val);
	}
}

// lists of data
class Arrayy {
	constructor(type, length) {
		this.size = type.size * length;
		this.length = length;
		this.type = type;
	}

	each(buffer, func) {
		const { size } = this.type;
		let offset = 0;
		for(let i = 0; i < this.length; i++) {
			const slice = buffer.slice(offset, offset += size);
			func(slice, i);
		}
	}
	
	read(buffer) {
		const arr = [];
		this.each(buffer, slice => {
			arr.push(this.type.read(slice));
		});
		return arr;
	}

	write(buffer, value) {
		if(!(value instanceof Array)) throw "cannot write array";
		if(value.length !== this.length) throw "incorrect length";
		this.each(buffer, (slice, i) => {
			this.type.write(slice, value[i]);
		});
	}
}

// will reimplement when needed
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

// module.exports = { Memory, Variable, Arayy, Struct };
module.exports = { Memory, Variable, Arrayy };
