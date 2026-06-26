import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src');

const headerText = `/**
 * @file %FILENAME%
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

`;

function processDir(dir) {
	const files = fs.readdirSync(dir);
	for (const file of files) {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()) {
			if (file !== 'assets') {
				processDir(fullPath);
			}
		} else if (file.endsWith('.ts') && !file.endsWith('.test.ts') && !file.endsWith('.d.ts')) {
			let content = fs.readFileSync(fullPath, 'utf8');
			// Check if header is already there
			if (!content.includes('@contributors')) {
				const relativeName = path.relative(srcDir, fullPath).replace(/\\/g, '/');
				const header = headerText.replace('%FILENAME%', relativeName);
				content = header + content;
				fs.writeFileSync(fullPath, content, 'utf8');
				console.log(`Added header to: ${relativeName}`);
			}
		}
	}
}

console.log('Adding contributor headers to source files...');
processDir(srcDir);
console.log('Headers processing completed successfully!');
