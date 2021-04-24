#include <stdio.h>

int isAlpha(char c) {
	return (c >= 'a' && c <= 'z')
		|| (c >= 'A' && c <= 'Z')
		|| c == '_';
}

int isDigit(char c) {
	return c >= '0' && c <= '9';
}

int word(int *pos, char *eq) {
	if(!isAlpha(eq[*pos])) return 1;
	char buffer[255] = { eq[(*pos)++] };
	for(int i = 1; 1; i++) {
		char c = eq[*pos];
		if(!isAlpha(c) && !isDigit(c)) break;
		buffer[i] += c;
		(*pos)++;
	}
	printf(buffer);
	return 0;
}

int main() {
	// char* input = "'hello worldn\'t'";
	int pos = 0;
	word(&pos, "hello worldn\'t'");
}
