const util = require("../core/util.js")

module.exports = {
	print(...args) {
		console.log(...args.map(i => util.format(i)));
		return null;
	},
	sqrt(arg) {
		return Math.sqrt(arg);
	},
	max(...args) {
		return Math.max(...args);
	},
	min(...args) {
		return Math.min(...args);
	},
};
