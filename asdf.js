const tokens = [];
const token = (type, value) => ({ type, value });

function escapeOf(char) {
	switch(char) {
		case "n": return "\n";
		case "t": return "\t";
		case "r": return "\r";
	}
	return char;
}

class Equation {
	constructor(raw) {
		this.raw = raw;
		this.i = 0;
	}

	next() { return this.raw[this.i++] }
	peek() { return this.raw[this.i] }
	undo() { this.i-- }
}

function number(eq) {
	let buf = "";
	let usedDec = false;
	if(eq.peek() === "0") buf += eq.next() + eq.next();
	while(true) {
		const ch = eq.next();
		if(/[0-9]/.test(ch)) {
			buf += ch;
		} else if(ch === "." && !usedDec) {
			eq.next();
			if(!/[0-9]/.test(eq.peek())) {
				eq.prev();
				break;
			}
			buf += ".";
			usedDec = true;
		} else break;
	}
	if(isNaN(buf)) throw new Error(`"${buf}" is not a number`);
	return token("number", Number(buf));
}

function string(eq) {
	const type = eq.next();
	let buf = "";
	while(true) {
		const ch = eq.next();
		if(!ch) throw new Error("unterminated string");
		if(ch === "\\") {
			buf += escapeOf(eq.next());
		} else if(ch === type) {
			break;
		} else {
			buf += ch;
		}
	}
	return token("string", buf);
}

function getToken(eq) {
	if(!eq.peek()) return null;
	if("1234567890".includes(eq.peek())) {
		return number(eq);
	} else if("'\"".includes(eq.peek())) {
		return string(eq);
	}
	return null;
}

function tokenize(str) {
	const eq = new Equation(str);
	getToken();
}

console.log(tokenize(new Equation("234 56 2")));
