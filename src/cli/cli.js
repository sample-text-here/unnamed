// TODO fix this!!!
// this is horribly broken and spaghetti code
// i will come back to this once i get the actual
// language done

const fs = require("fs");
const { color } = require("../data/color.js")
const tokenize = require("../core/tokenize.js");
const gentree = require("../core/tree.js");
const util = require("../core/util.js");
const meta = require("../meta.json");
const parse = require("./argparse.js");
const { Memory } = require("../data/memory.js");
const interpret = require("../core/interpret.js");

function normalize(data) {
	if(data instanceof Array) return data.map(i => i.value ?? i).join("");
	return data.value ?? data.toString();
}

function getPos(gen) {
	const str = normalize(gen.data);
	let index = 0, row = 1, col = 1;
	
	if(gen.data instanceof Array) {
		for(let i = 0; i < gen.i; i++) index += gen.data[i].length;
	} else {
		index = gen.data.length;
	}
	
	for(let i = 0; i < index; i++) {
		col++;
		if(str[i] === '\n') {
			col = 1;
			row++;
		}
	}
	
	return [row, col];
}

function displayCurrent(gen) {
	const start = normalize(gen.data.slice(Math.max(gen.i - 10, 0), gen.i)).match(/.+$/) || "";
	const main = normalize(gen.next()).match(/.+/) || ""
	const end = normalize(gen.data.slice(gen.i, Math.max(gen.i + 10, gen.data.length))).match(/^.+/) || ""
	const arrows = " ".repeat(start.length) + "^".repeat(main.length);
	const pos = getPos(gen).join(":");
	return `at ${pos}\n${start}${main}${end}\n${arrows}`;
}

function main(code) {
	console.log("input:", code);
	const tokens = util.removeComments(tokenize(new util.Generator(code)));
	console.log("tokens:", tokens);
	const gen = gentree(new util.Generator(tokens));
	console.log("tree:", require("util").inspect(gen, false, 8, true));
	util.simplify(gen);
	console.log("optimized:", gen);
}

function error(why) {
	console.error(color(why, "red"));
	process.exit(1);
}

function read(file) {
	if(!file) error("no file");
	if(!fs.existsSync(file)) error("file does not exist");
	if(fs.lstatSync(file).isDirectory()) error("cannot read folder");
	try {
		return fs.readFileSync(file, "utf8");
	} catch {
		error("cannot read file");
	}
}

const commands = {
	help: {
		description: "show this help",
		args: { },
		call(argv) {
			if(argv._[0]) {
				if(!commands.hasOwnProperty(argv._[0])) {
					error("subcommand does not exist");
				}
				console.log(`${color(argv._[0], "cyan")}`);
				console.log(`${commands[argv._[0]].description}`);
				console.log(`\n`);
			} else {
				console.log(`${color(meta.name, "blue")} v${meta.version}`);
				console.log(`=======`);
				for(let cmd in commands) {
					const name = color(cmd.padEnd(10), "cyan");
					console.log(`${name}${commands[cmd].description}`);
				}
			}
		},
	},
	repl: {
		description: "open a read/print/eval/loop",
		args: {},
		call() {
			require("./repl.js")
		},
	},
	validate: {
		description: "(NEED TO DO) check for syntax errors",
		args: {},
		call(args) {
			const file = read(args._[0]);
			let gen;
			try {
				gen = new util.Generator(file);
				const tokens = util.removeComments(tokenize(gen));
				gen = new util.Generator(tokens);
				const tree = gentree(gen);
				util.simplify(tree);
				console.log(tree);
			} catch(err) {
				const msg = `${color("error! " + err, "red")}\n${displayCurrent(gen)}\n`;
				process.stderr.write(msg);
				process.exit(2);
			}
		},
	},
	run: {
		description: "interpret without compiling",
		args: {},
		call(args) {
			const file = read(args._[0]);
			const tokens = util.removeComments(tokenize(new util.Generator(file)));
			const gen = gentree(new util.Generator(tokens));
			const memory = new Memory();
			const ctx = util.Context.fromMemory(memory);
			interpret(gen, ctx);
		},
	},
	compile: {
		description: "(NEED TO DO) compile into a static binary",
		args: {},
		call() {},
	},
};

if(!process.argv[2]) {
	commands.repl.call();
} else if(commands.hasOwnProperty(process.argv[2])) {
	const cmd = commands[process.argv[2]];
	cmd.call(parse(process.argv.slice(3), cmd.args));
}
