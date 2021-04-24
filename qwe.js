const token = (type, value) => ({ type, value });
const isDigit = char => char >= '0' && char <= '9';
const isLowerAlpha = char => char >= 'a' && char <= 'z';
const isUpperAlpha = char => char >= 'A' && char <= 'Z';
const isAlpha = char => isLowerAlpha(char) || isUpperAlpha(char);
const isWhitespace = char => /\s/.test(char);

function number(gen) {
	let buffer = "";
	let usedDecimal = false;
	if(gen.peek() === '0') buffer += gen.next() + gen.next();
	while(true) {
		const char = gen.peek();
		if(isDigit(char)) {
			buffer += gen.next();
		} else if(char === '.') {
			if(usedDecimal) throw "extra decimal point";
			buffer += gen.next();
			if(!isDigit(gen.peek())) throw "bad decimal point";
			usedDecimal = true;
		} else break;
	}
	if(isNaN(buffer)) throw "not a number";
	return token("number", Number(buffer));
}

function word(gen) {
	let buffer = gen.next();
	if(!isAlpha(buffer)) throw "invalid word";
	while(true) {
		const char = gen.peek();
		if(!isAlpha(char)) break;
		buffer += gen.next();
	}
	return token("word", buffer);
}

const combos = ["==", "!=", ">=", "<=", ">>", "<<"];
function symbol(gen) {
	const char = gen.next();
	if(combos.includes(char + gen.peek())) {
		return token("symbol", char + gen.next());
	}
	return token("symbol", char);
}

function tokenize(eq) {
	const tokens = [];
	const gen = {
		i: 0,
		next: () => eq[gen.i++],
		peek: () => eq[gen.i],
	};
	while(gen.i < eq.length) {
		const next = gen.peek();
		if(isDigit(next)) {
			tokens.push(number(gen));
		} else if(isAlpha(next)) {
			tokens.push(word(gen));
		} else if(isWhitespace(next)) {
			gen.next();
		} else {
			tokens.push(symbol(gen));
		}
	}
	return tokens;
}

function tree(tokens) {
	const ops = [];
	const stack = [];
	for(let i = 0; i < tokens.length; i++) {
		
	}
}

// console.log(tree(tokenize("x = 1+23*4")));
console.log(tree(tokenize("1+2")));
