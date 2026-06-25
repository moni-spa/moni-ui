const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '../src/assets');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg')).sort();
const map = {};
for (const file of files) {
	const content = fs.readFileSync(path.join(dir, file), 'utf8');
	const m = content.match(/d="([^"]+)"/);
	if (m) {
		map[file.replace('.svg', '')] = m[1];
	}
}
console.log(JSON.stringify(map, null, 2));
