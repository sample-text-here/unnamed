const ansi = (what = "") => `\x1b[${what}`;

const colors = {
	reset:	ansi("0m"),
	black:	ansi("30m"),
	red:	ansi("31m"),
	green:	ansi("32m"),
	yellow:	ansi("33m"),
	blue:	ansi("34m"),
	purple:	ansi("35m"),
	cyan:	ansi("36m"),
	white:	ansi("37m"),
}

module.exports = {
	...colors,
	color(text, colorName) {
		if(!colors.hasOwnProperty(colorName)) throw "color does not exist";
		if(process.env.NO_COLOR) return text;
		return `${colors[colorName]}${text}${colors.reset}`
	},
};
