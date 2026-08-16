const fs = require('fs');
const path = require('path');
const shapePaths = require('./shape-paths.cjs');
const { generateClipPaths } = require('./generate-clip-paths.cjs');

const assetsDir = path.resolve(__dirname, '../src/assets');
const outFile = path.resolve(__dirname, '../src/components/moni-shape.ts');
const files = fs.readdirSync(assetsDir).filter((file) => file.endsWith('.svg')).sort();

const genericTypes = ['rounded', 'top-round', 'bottom-round', 'left-round', 'right-round'];
const m3eNames = [
  '4-leaf-clover', '4-sided-cookie', '6-sided-cookie', '7-sided-cookie',
  '8-leaf-clover', '9-sided-cookie', '12-sided-cookie', 'arch', 'arrow',
  'boom', 'bun', 'burst', 'circle', 'diamond', 'fan', 'flower', 'gem',
  'ghost-ish', 'heart', 'hexagon', 'oval', 'pentagon', 'pill', 'pixel-circle',
  'pixel-triangle', 'puffy', 'puffy-diamond', 'semicircle', 'slanted',
  'soft-boom', 'soft-burst', 'square', 'sunny', 'triangle', 'very-sunny'
];
const aliases = {
  'leaf-clover4': '4-leaf-clover', 'leaf-clover8': '8-leaf-clover',
  'sided-cookie4': '4-sided-cookie', 'sided-cookie6': '6-sided-cookie',
  'sided-cookie7': '7-sided-cookie', 'sided-cookie9': '9-sided-cookie',
  'sided-cookie12': '12-sided-cookie'
};
const expressiveTypes = files.map((file) => file.replace('.svg', ''));
const allTypes = [...new Set([...genericTypes, ...expressiveTypes, 'hexagon'])];
const legacyTypes = allTypes.filter((type) => !m3eNames.includes(aliases[type] || type));

function encodeSvg(svg) {
  return svg.replace(/"/g, "'").replace(/%/g, '%25').replace(/#/g, '%23')
    .replace(/</g, '%3C').replace(/>/g, '%3E').replace(/\s+/g, ' ').trim();
}

const masks = [];
for (const type of legacyTypes) {
  const file = path.join(assetsDir, `${type}.svg`);
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  const viewBox = content.match(/viewBox="([^"]+)"/)?.[1];
  const d = content.match(/d="([^"]+)"/)?.[1];
  if (!viewBox || !d) continue;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewBox}'><path d='${d}' fill='#fff'/></svg>`;
  masks.push(`:host([type='${type}']) .shape { mask-image:url("data:image/svg+xml,${encodeSvg(svg)}");-webkit-mask-image:url("data:image/svg+xml,${encodeSvg(svg)}"); }`);
}

const polygonValues = generateClipPaths(Object.values(shapePaths), 300);
const polygonByName = Object.fromEntries(Object.keys(shapePaths).map((name, index) => [name, polygonValues[index]]));
const polygonRules = Object.entries(polygonByName).flatMap(([name, polygon]) => {
  const rules = [`:host([name='${name}']) .shape { clip-path:polygon(${polygon}); }`];
  const localTypes = [name, ...Object.keys(aliases).filter((type) => aliases[type] === name)];
  for (const type of localTypes) {
    if (allTypes.includes(type)) rules.push(`:host(:not([name])[type='${type}']) .shape,:host([name=''][type='${type}']) .shape { clip-path:polygon(${polygon}); }`);
  }
  return rules;
});

const union = (values) => values.map((value) => `'${value}'`).join(' | ');
const source = `import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';

export type MoniShapeType = ${union(allTypes)};
export type MoniShapeName = ${union(m3eNames)};

/** Material 3 Expressive shape with built-in polygon morphing. */
@customElement('moni-shape')
export class MoniShape extends MoniElement {
  /** Backwards-compatible Moni shape name. */
  @property({ reflect: true }) type: MoniShapeType = 'rounded';
  /** M3E name alias. When set, it takes precedence over type. */
  @property({ reflect: true }) name: MoniShapeName | '' = '';
  @property({ reflect: true }) size: 'small' | 'medium' | 'large' | 'extra' = 'medium';
  @property({ type: Boolean, reflect: true }) border = false;
  @property({ type: Boolean, reflect: true }) shadow = false;
  @property({ reflect: true, attribute: 'shape-radius' }) shapeRadius = '';
  @property({ reflect: true }) color: 'primary' | 'secondary' | 'tertiary' | 'surface' = 'primary';
  /** Duration used when morphing from one named shape to another. */
  @property({ reflect: true }) duration = '500ms';
  /** CSS easing used by the morph transition. */
  @property({ reflect: true }) easing = 'cubic-bezier(.2, 0, 0, 1)';

  static override styles = [sharedStyles, css\`
    :host { display:inline-flex; font-family:var(--font-sans); }
    .shape {
      inline-size:var(--_shape-size,4rem);block-size:var(--_shape-size,4rem);
      color:var(--_shape-fg,var(--color-on-primary-container));
      transition:clip-path var(--_morph-duration,500ms) var(--_morph-easing,cubic-bezier(.2,0,0,1));
      will-change:clip-path;transform-origin:center;
      box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;
      overflow:hidden;background:var(--_shape-bg,var(--color-primary-container));
      border-radius:var(--_radius,1rem);mask-size:100% 100%;mask-repeat:no-repeat;
      -webkit-mask-size:100% 100%;-webkit-mask-repeat:no-repeat; }
    :host([size='small']) { --_shape-size:2rem; }
    :host([size='medium']) { --_shape-size:4rem; }
    :host([size='large']) { --_shape-size:6rem; }
    :host([size='extra']) { --_shape-size:8rem; }
    :host([type='top-round']) .shape { border-radius:1rem 1rem 0 0; }
    :host([type='bottom-round']) .shape { border-radius:0 0 1rem 1rem; }
    :host([type='left-round']) .shape { border-radius:1rem 0 0 1rem; }
    :host([type='right-round']) .shape { border-radius:0 1rem 1rem 0; }
    ${masks.join('\n    ')}
    ${polygonRules.join('\n    ')}
    :host([border]) .shape { border:.0625rem solid var(--color-outline-variant); }
    :host([shadow]) .shape { filter:drop-shadow(0 .125rem .125rem rgb(0 0 0 / .18)); }
    :host([color='secondary']) { --_shape-bg:var(--color-secondary-container);--_shape-fg:var(--color-on-secondary-container); }
    :host([color='tertiary']) { --_shape-bg:var(--color-tertiary-container);--_shape-fg:var(--color-on-tertiary-container); }
    :host([color='surface']) { --_shape-bg:var(--color-surface-container-highest);--_shape-fg:var(--color-on-surface); }
    @media (prefers-reduced-motion:reduce) { .shape { transition:none; } }
  \`];

  override render() {
    const style = \`--_radius:\${this.shapeRadius || '1rem'};--_morph-duration:\${this.duration};--_morph-easing:\${this.easing};\`;
    return html\`<div class="shape" style=\${style} part="shape"><slot></slot></div>\`;
  }
}

declare global { interface HTMLElementTagNameMap { 'moni-shape': MoniShape; } }
export default MoniShape;
`;

fs.writeFileSync(outFile, source);
console.log('Wrote', outFile);
