// tools for making colored text
const ansi = (what = "") => `\x1b[${what}m`;
const colors = {
	reset:	ansi("0"),
	bold:	ansi("1"),
	black:	ansi("30"),
	red:	ansi("31"),
	green:	ansi("32"),
	yellow:	ansi("33"),
	blue:	ansi("34"),
	purple:	ansi("35"),
	cyan:	ansi("36"),
	white:	ansi("37"),
	gray:	ansi("90"),
}

module.exports = {
	...colors,
	color(text, colorName) {
		if(!colors.hasOwnProperty(colorName)) throw "color does not exist";
		if(process.env.NO_COLOR) return text;
		return `${colors[colorName]}${text}${colors.reset}`
	},
};
