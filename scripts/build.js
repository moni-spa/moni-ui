import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const srcStylesDir = path.resolve(rootDir, 'src/styles');
const distStylesDir = path.resolve(distDir, 'styles');
const srcAssetsDir = path.resolve(rootDir, 'src/assets');
const distAssetsDir = path.resolve(distDir, 'assets');

console.log('📦 Starting build for @moni-labs/moni-ui...');

// 1. Clean dist directory
console.log('🧹 Cleaning dist directory...');
fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

// 2. Generate shape component
console.log('⚡ Generating expressive shape component...');
execSync('node scripts/build-shape-component.cjs', { cwd: rootDir, stdio: 'inherit' });

// 3. Compile TypeScript
console.log('🚀 Compiling TypeScript...');
	try {
		let compilerCmd = 'npx --package=typescript tsc';
		const localPaths = [
			path.resolve(rootDir, 'node_modules/.bin/tsc'),
			path.resolve(rootDir, 'node_modules/.bin/tsc.cmd'),
			path.resolve(rootDir, '../../node_modules/.bin/tsc'),
			path.resolve(rootDir, '../../node_modules/.bin/tsc.cmd')
		];
		for (const p of localPaths) {
			if (fs.existsSync(p)) {
				compilerCmd = `"${p}"`;
				break;
			}
		}
		console.log(`Using compiler command: ${compilerCmd}`);
		execSync(`${compilerCmd} -p tsconfig.build.json`, { cwd: rootDir, stdio: 'inherit' });
	} catch (error) {
	console.error('❌ TypeScript compilation failed.');
	process.exit(1);
}

// 4. Copy styles to dist
console.log('🎨 Copying stylesheets to dist/styles...');
if (fs.existsSync(srcStylesDir)) {
	fs.cpSync(srcStylesDir, distStylesDir, { recursive: true });
} else {
	console.warn('⚠️ src/styles directory not found!');
}

// 5. Copy font assets to dist
console.log('🔤 Copying font and SVG assets to dist/assets...');
if (fs.existsSync(srcAssetsDir)) {
	fs.cpSync(srcAssetsDir, distAssetsDir, { recursive: true });
} else {
	console.warn('⚠️ src/assets directory not found!');
}

// 6. Run manifest analyzer to generate custom-elements.json
console.log('📋 Analyzing custom elements manifest...');
try {
	const analyzerPath = path.resolve(rootDir, 'node_modules/.bin/custom-elements-manifest');
	execSync(`"${analyzerPath}" analyze`, { cwd: rootDir, stdio: 'inherit' });
	console.log('✅ Generated custom-elements.json');
} catch (error) {
	console.warn('⚠️ Failed to generate custom-elements.json. Analyzer might not be fully configured.');
}

console.log('✅ Build completed successfully!');
