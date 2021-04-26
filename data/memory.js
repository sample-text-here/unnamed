class Memory {
	constructor(size = 4096) {
		this.buffer = Buffer.alloc(size);
		this.offset = 0;
		this.size = size;
		this.allocs = new Map();
	}

	alloc(size) {
		const off = this.offset;
		this.offset += size;
		if(this.offset > this.size) throw "out of memory!";
		return this.buffer.slice(off, off + size);
	}
}

class Variable {
	constructor(type) {
		this.type = type;
		this.memory = null;
	}

	attach(memory) {
		if(this.memory !== null) throw "memory already allocated";
		this.memory = memory.alloc(this.type.size);
	}
	
	read() {
		if(this.memory === null) throw "no memory allocated";
		return this.memory["read" + this.type.access]();
	}

	write(value) {
		if(this.memory === null) throw "no memory allocated";
		this.memory["write" + this.type.access](value);
	}
}

// 100% legit array
class Arrey {
	constructor(type, length) {
		this.type = type;
		this.length = length;
		this.memory = null;
	}

	attach(memory) {
		if(this.memory !== null) throw "memory already allocated";
		this.memory = memory.alloc(this.type.size * this.length);
	}
	
	read(index) {
		if(this.memory === null) throw "no memory allocated";
		return this.memory["read" + this.type.access](this.type.size * index);
	}

	write(index, value) {
		if(this.memory === null) throw "no memory allocated";
		this.memory["write" + this.type.access](value, this.type.size * index);
	}
}

class Struct {
	constructor() {
		this.parts = new Map();
		this.size = 0;
		this.memory = null;
	}

	attatch(memory) {
		if(this.memory !== null) throw "memory already allocated";
		this.memory = memory.alloc(this.size);
	}

	add(name, type) {
		if(this.ptr !== null) throw "memory already allocated";
		if(this.parts.has(name)) throw name + " already exists on struct";
		this.parts.set(name, { offset: this.size, type });
		this.size += type.size;
	}

	get(name) {
		if(!this.parts.has(name)) throw name + " doesnt exist on struct";
		return this.parts.get(name);
	}

	read(name) {
		if(this.ptr === null) throw "no memory attached";
		const { offset, type } = this.get(name);
		return this.memory["read" + type.access](offset);
	}

	write(name, value) {
		if(this.ptr === null) throw "no memory attached";
		const { offset, type } = this.get(name);
		this.memory["write" + type.access](value, offset);
	}
}

module.exports = { Memory, Variable, Arrey, Struct };
