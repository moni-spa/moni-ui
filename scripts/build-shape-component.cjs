const fs = require('fs');
const path = require('path');

const assetsDir = path.resolve(__dirname, '../src/assets');
const outFile = path.resolve(__dirname, '../src/components/moni-shape.ts');

const files = fs.readdirSync(assetsDir)
  .filter(f => f.endsWith('.svg'))
  .sort();

// circle.svg and square.svg clash with the generic Material shapes; keep them generic.
const genericTypes = ['square', 'rounded', 'circle', 'top-round', 'bottom-round', 'left-round', 'right-round'];
const expressiveFiles = files.filter(f => {
  const name = f.replace('.svg', '');
  return !genericTypes.includes(name);
});
const shapeTypes = expressiveFiles.map(f => f.replace('.svg', ''));

function encodeSvg(svg) {
  return svg
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .replace(/\s+/g, ' ')
    .trim();
}

const masks = [];
for (const file of expressiveFiles) {
  const content = fs.readFileSync(path.join(assetsDir, file), 'utf8');
  const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
  const dMatch = content.match(/d="([^"]+)"/);
  if (!viewBoxMatch || !dMatch) continue;
  const viewBox = viewBoxMatch[1];
  const d = dMatch[1];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'><path d='${d}' fill='#fff'/></svg>`;
  const type = file.replace('.svg', '');
  masks.push(`\t\t\t:host([type='${type}']) .shape { mask-image: url("data:image/svg+xml,${encodeSvg(svg)}"); -webkit-mask-image: url("data:image/svg+xml,${encodeSvg(svg)}"); }`);
}

const genericOptions = genericTypes.map(t => `'${t}'`).join(' | ');
const shapeOptions = shapeTypes.map(t => `'${t}'`).join(' | ');
const allTypes = [...genericTypes, ...shapeTypes];

const source = `import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Visual-only shape helper.
 *
 * Supports Material 3 generic shapes (rounded, circle, …) and expressive
 * SVG masks (heart, star, boom, sided-cookie12, …).
 *
 * @example
 * <moni-shape type="rounded" border shadow>
 *   <p>Some content</p>
 * </moni-shape>
 * <moni-shape type="heart" size="large"></moni-shape>
 */
@customElement('moni-shape')
export class MoniShape extends MoniElement {
	@property({ reflect: true }) type:
		| ${genericOptions}
		| ${shapeOptions} = 'rounded';
	@property({ reflect: true }) size: 'small' | 'medium' | 'large' | 'extra' = 'medium';
	@property({ type: Boolean, reflect: true }) border = false;
	@property({ type: Boolean, reflect: true }) shadow = false;
	@property({ reflect: true, attribute: 'shape-radius' }) shapeRadius = '';
	@property({ reflect: true }) color: 'primary' | 'secondary' | 'tertiary' | 'surface' = 'primary';

	static override styles = [
		sharedStyles,
		css\`
			:host {
				display: inline-flex;
				font-family: var(--font-sans);
			}

			.shape {
				box-sizing: border-box;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				inline-size: var(--_shape-size, 4rem);
				block-size: var(--_shape-size, 4rem);
				border-radius: var(--_radius, 1rem);
				overflow: hidden;
				background-color: var(--_shape-bg, var(--color-primary-container));
				color: var(--_shape-fg, var(--color-on-primary-container));
				mask-size: 100% 100%;
				mask-repeat: no-repeat;
				-webkit-mask-size: 100% 100%;
				-webkit-mask-repeat: no-repeat;
			}

			:host([size='small']) .shape { --_shape-size: 2rem; }
			:host([size='medium']) .shape { --_shape-size: 4rem; }
			:host([size='large']) .shape { --_shape-size: 6rem; }
			:host([size='extra']) .shape { --_shape-size: 8rem; }

			/* Generic shapes */
			:host([type='square']) .shape { border-radius: 0; }
			:host([type='circle']) .shape { border-radius: 50%; aspect-ratio: 1; }
			:host([type='top-round']) .shape { border-radius: 1rem 1rem 0 0; }
			:host([type='bottom-round']) .shape { border-radius: 0 0 1rem 1rem; }
			:host([type='left-round']) .shape { border-radius: 1rem 0 0 1rem; }
			:host([type='right-round']) .shape { border-radius: 0 1rem 1rem 0; }

			/* Expressive SVG masks */
${masks.join('\n')}

			:host([border]) .shape { border: 0.0625rem solid var(--color-outline-variant); }
			:host([shadow]) .shape { box-shadow: var(--shadow-1); }

			:host([color='secondary']) .shape { --_shape-bg: var(--color-secondary-container); --_shape-fg: var(--color-on-secondary-container); }
			:host([color='tertiary']) .shape { --_shape-bg: var(--color-tertiary-container); --_shape-fg: var(--color-on-tertiary-container); }
			:host([color='surface']) .shape { --_shape-bg: var(--color-surface-container-highest); --_shape-fg: var(--color-on-surface); }
		\`
	];

	override render() {
		const style = this.shapeRadius ? \`--_radius: \${this.shapeRadius};\` : '';
		return html\`
			<div class="shape" part="shape" style="\${style}">
				<slot></slot>
			</div>
		\`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-shape': MoniShape;
	}
}

export default MoniShape;
`;

fs.writeFileSync(outFile, source);
console.log('Wrote', outFile);
