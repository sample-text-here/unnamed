// builtin functions
const util = require("../core/util.js")

module.exports = {
	print(...args) {
		console.log(...args.map(i => util.format(i)));
		return null;
	},
	sqrt(arg) {
		return Math.sqrt(arg);
	},
	abs(arg) {
		return Math.abs(arg);
	},
	floor(arg) {
		return Math.floor(arg);
	},
	ceil(arg) {
		return Math.ceil(arg);
	},
	round(arg) {
		return Math.round(arg);
	},
	max(...args) {
		return Math.max(...args);
	},
	min(...args) {
		return Math.min(...args);
	},
	sin(arg) {
		return Math.sin(arg);
	},
	cos(arg) {
		return Math.cos(arg);
	},
	tan(arg) {
		return Math.tan(arg);
	},
	random() {
		return Math.random();
	},
};
