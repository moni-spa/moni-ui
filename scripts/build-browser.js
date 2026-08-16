import fs from 'node:fs';
import path from 'node:path';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { transform } from 'lightningcss';
import { build } from 'vite';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(rootDir, 'dist', 'browser');
const cdnOutDir = path.join(rootDir, 'dist', 'cdn');

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

console.log('🧩 Building modular CDN distribution...');

const componentsDir = path.join(rootDir, 'src', 'components');
const componentFiles = fs.readdirSync(componentsDir)
	.filter((file) => /^moni-.*\.ts$/.test(file) && !file.endsWith('.test.ts'))
	.sort();
const componentInputs = Object.fromEntries(componentFiles.map((file) => {
	const basename = file.replace(/\.ts$/, '');
	return [`components/${basename}`, path.join(componentsDir, file)];
}));

await build({
	configFile: false,
	root: rootDir,
	build: {
		outDir: cdnOutDir,
		emptyOutDir: true,
		minify: 'oxc',
		sourcemap: false,
		rollupOptions: {
			input: componentInputs,
			output: {
				format: 'es',
				entryFileNames: '[name].js',
				chunkFileNames: 'chunks/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash][extname]',
			},
		},
	},
});

fs.copyFileSync(
	path.join(outDir, 'moni-ui.min.css'),
	path.join(cdnOutDir, 'moni-ui.min.css'),
);

const packageJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
const cdnBase = `https://cdn.jsdelivr.net/npm/${packageJson.name}@${packageJson.version}/dist/cdn`;
const imports = {};
for (const file of componentFiles) {
	const component = file.replace(/^moni-/, '').replace(/\.ts$/, '');
	const url = `${cdnBase}/components/moni-${component}.js`;
	imports[`@moni-ui/${component}`] = url;
	imports[`${packageJson.name}/${component}`] = url;
}
fs.writeFileSync(
	path.join(cdnOutDir, 'importmap.json'),
	`${JSON.stringify({ imports }, null, 2)}\n`,
);

const entrySize = componentFiles.reduce((total, file) => {
	const output = path.join(cdnOutDir, 'components', file.replace(/\.ts$/, '.js'));
	return total + fs.statSync(output).size;
}, 0);
console.log(`  ${componentFiles.length} component entries: ${(entrySize / 1024).toFixed(1)} kB total`);
console.log(`  importmap.json: ${(fs.statSync(path.join(cdnOutDir, 'importmap.json')).size / 1024).toFixed(1)} kB`);
console.log('✅ Modular CDN distribution generated.');
