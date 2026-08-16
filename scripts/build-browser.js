import fs from 'node:fs';
import path from 'node:path';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';
import { build } from 'vite';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(rootDir, 'dist', 'browser');

console.log('🌐 Building minified browser bundles...');

await build({
	configFile: false,
	root: rootDir,
	build: {
		outDir,
		emptyOutDir: true,
		minify: 'oxc',
		sourcemap: true,
		lib: {
			entry: path.join(rootDir, 'src', 'browser.ts'),
			name: 'MoniUI',
			formats: ['es', 'iife'],
			fileName: (format) => format === 'es' ? 'moni-ui.min.js' : 'moni-ui.iife.min.js',
			cssFileName: 'moni-ui.min',
		},
	},
});

const styleFiles = ['tokens.css', 'animations.css', 'base.css'];
const stylesheet = styleFiles
	.map((file) => fs.readFileSync(path.join(rootDir, 'src', 'styles', file), 'utf8'))
	.join('\n');
const minifiedStyles = transform({
	filename: 'moni-ui.css',
	code: Buffer.from(stylesheet),
	minify: true,
	sourceMap: true,
});
fs.writeFileSync(path.join(outDir, 'moni-ui.min.css'), minifiedStyles.code);
fs.writeFileSync(path.join(outDir, 'moni-ui.min.css.map'), minifiedStyles.map);

const compressible = fs.readdirSync(outDir)
	.filter((file) => file.endsWith('.js') || file.endsWith('.css'));

for (const file of compressible) {
	const sourcePath = path.join(outDir, file);
	const source = fs.readFileSync(sourcePath);
	fs.writeFileSync(`${sourcePath}.gz`, gzipSync(source, { level: 9 }));
	fs.writeFileSync(`${sourcePath}.br`, brotliCompressSync(source, {
		params: {
			[constants.BROTLI_PARAM_QUALITY]: 11,
		},
	}));
}

for (const file of fs.readdirSync(outDir).sort()) {
	const size = fs.statSync(path.join(outDir, file)).size;
	console.log(`  ${file}: ${(size / 1024).toFixed(1)} kB`);
}

console.log('✅ Browser bundles and compressed assets generated.');
