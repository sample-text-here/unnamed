module.exports = {
	print(...args) {
		console.log(...args);
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
