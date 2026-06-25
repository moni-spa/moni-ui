// Vite asset module declarations.
// See https://vitejs.dev/guide/assets.html#importing-asset-as-url

declare module '*.svg?url' {
	const url: string;
	export default url;
}

declare module '*.svg' {
	const url: string;
	export default url;
}
