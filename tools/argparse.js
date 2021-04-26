const { Generator } = require("../core/util.js")

function readFlag(gen, args, pattern) {
	const flag = gen.next();
	const name = flag[1] === "-" ? flag.slice(2) : flag.slice(1);
	if(!pattern.hasOwnProperty(name)) throw "unknown flag " + flag;
	if(pattern[name] === "boolean") {
		args[name] = true;
	} else if(pattern[name] === "int") {
		args[name] = parseInt(gen.next(), 10);
		if(isNaN(args[name])) throw "invalid value for " + flag;
	} else {
		args[name] = gen.next();
		if(!args[name]) throw "missing value for " + flag;
	}
}

function parse(argv, pattern) {
	const gen = new Generator(argv);
	const args = { _: [] };
	while(!gen.done()) {
		const next = gen.peek();
		if(next[0] === "-") {
			readFlag(gen, args, pattern);
		} else {
			args._.push(gen.next());
		}
	}
	return args;
}

module.exports = parse;
