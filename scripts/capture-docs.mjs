import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const api = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'api.json'), 'utf8'));
const componentFilter = process.argv.find((arg) => arg.startsWith('--component='))?.split('=')[1];
const assets = path.join(root, 'docs', 'assets');
const browserScript = path.join(root, 'dist', 'browser', 'moni-ui.iife.min.js');
const browserStyles = path.join(root, 'dist', 'browser', 'moni-ui.min.css');
if (!fs.existsSync(browserScript)) throw new Error('Run npm run build before docs:capture.');

const children = {
  'moni-app-bar': '<span slot="headline">Moni Studio</span><moni-button slot="actions" icon="search" shape="circle" aria-label="Buscar"></moni-button>',
  'moni-button': 'Continuar', 'moni-chip': 'Diseño', 'moni-typography': 'Moni UI', 'moni-tooltip': '<moni-button>Información</moni-button>',
  'moni-card': '<moni-typography variant="title">Proyecto Aurora</moni-typography><p>Una tarjeta de ejemplo.</p>',
  'moni-carousel': '<moni-card>Proyecto uno</moni-card><moni-card>Proyecto dos</moni-card><moni-card>Proyecto tres</moni-card>',
  'moni-select': '<moni-select-option value="design">Diseño</moni-select-option><moni-select-option value="development">Desarrollo</moni-select-option>',
  'moni-select-option': 'Opción seleccionable',
  'moni-list': '<moni-list-item headline="Actividad reciente" supporting-text="Actualizado hace 5 minutos"></moni-list-item><moni-list-item headline="Nuevo proyecto"></moni-list-item>',
  'moni-list-item': 'Elemento de lista',
  'moni-menu': '<moni-menu-item icon="edit">Editar</moni-menu-item><moni-menu-item icon="delete">Eliminar</moni-menu-item>',
  'moni-menu-item': 'Editar',
  'moni-nav': '<moni-nav-item icon="home" label="Inicio" active></moni-nav-item><moni-nav-item icon="folder" label="Proyectos"></moni-nav-item>',
  'moni-nav-item': 'Inicio',
  'moni-tabs': '<moni-tab active>Resumen</moni-tab><moni-tab>Actividad</moni-tab><moni-tab>Equipo</moni-tab>',
  'moni-tab': 'Resumen',
  'moni-stepper': '<moni-step label="Datos" completed></moni-step><moni-step label="Diseño" active></moni-step><moni-step label="Publicar"></moni-step>',
  'moni-step': 'Paso',
  'moni-toolbar': '<moni-button icon="undo" shape="circle"></moni-button><moni-button icon="redo" shape="circle"></moni-button>',
  'moni-expansion': '<span slot="header">Detalles del proyecto</span><p>Contenido expandible.</p>',
  'moni-button-group': '<moni-button active>Uno</moni-button><moni-button>Dos</moni-button><moni-button>Tres</moni-button>',
  'moni-segmented-button': '<moni-button-segment checked value="day">Día</moni-button-segment><moni-button-segment value="week">Semana</moni-button-segment>',
  'moni-button-segment': 'Día',
  'moni-split-button': '<moni-button slot="leading-button" icon="save">Guardar</moni-button><moni-button slot="trailing-button" icon="arrow_drop_down" shape="circle"></moni-button>',
  'moni-fab-menu': '<moni-fab slot="trigger" icon="add"></moni-fab><moni-fab icon="edit" label="Editar"></moni-fab><moni-fab icon="share" label="Compartir"></moni-fab>',
  'moni-bottom-sheet': '<span slot="headline">Opciones</span><p>Contenido del bottom sheet.</p>',
  'moni-side-sheet': '<span slot="headline">Detalles</span><p>Contenido del side sheet.</p>',
  'moni-dialog': '<span slot="headline">Confirmar acción</span><p>¿Deseas continuar?</p><moni-button slot="actions">Aceptar</moni-button>',
  'moni-morph-modal': '<span slot="header">Nuevo proyecto</span><p>Contenido del modal expresivo.</p>',
  'moni-context-menu': '<moni-menu-item>Copiar</moni-menu-item><moni-menu-item>Pegar</moni-menu-item>',
};

const preferred = {
  label: 'Componente', headline: 'Título', supportingText: 'Descripción de apoyo', value: '50', max: '100', min: '0', icon: 'favorite',
  name: 'demo', placeholder: 'Escribe aquí', helper: 'Texto de ayuda', text: 'Texto de ejemplo', src: '', alt: 'Vista previa',
  open: true, active: true, checked: true, selected: true, expanded: true, show: true, visible: true,
};
const kebab = (name) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
const safe = (value) => String(value).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'empty';
const stripQuotes = (value) => String(value ?? '').replace(/^['"`]|['"`]$/g, '');
const boolType = (prop) => prop.type === 'boolean' || /Boolean/.test(prop.type);

function defaultValue(prop) {
  if (prop.name in preferred && (prop.default == null || stripQuotes(prop.default) === '' || ['value', 'open', 'active', 'checked', 'selected', 'expanded', 'show', 'visible'].includes(prop.name))) return preferred[prop.name];
  if (boolType(prop)) return stripQuotes(prop.default) === 'true';
  if (prop.options.length) {
    const current = stripQuotes(prop.default);
    return prop.options.includes(current) ? current : prop.options[0];
  }
  if (/number/.test(prop.type)) return Number(stripQuotes(prop.default)) || 1;
  return stripQuotes(prop.default ?? '');
}

function scenarios(component) {
  return component.properties.flatMap((prop) => {
    if (!prop.attribute) return [];
    const values = prop.options.length ? prop.options : boolType(prop) ? [false, true] : [defaultValue(prop)];
    return values.map((value) => ({ prop, value, key: prop.options.length || boolType(prop) ? value : 'default' }));
  });
}

function markup(component, scenario) {
  const attrs = [];
  for (const prop of component.properties) {
    if (!prop.attribute) continue;
    const value = prop.name === scenario.prop.name ? scenario.value : defaultValue(prop);
    if (boolType(prop)) { if (value === true || value === 'true') attrs.push(prop.attribute); }
    else if (value !== '' && value != null && !['styles'].includes(prop.name)) attrs.push(`${prop.attribute}="${String(value).replace(/"/g, '&quot;')}"`);
  }
  if (component.tag === 'moni-progress' && !attrs.some((item) => item.startsWith('value='))) attrs.push('value="62"');
  if (['moni-dialog', 'moni-bottom-sheet', 'moni-side-sheet', 'moni-morph-modal', 'moni-menu', 'moni-context-menu', 'moni-fab-menu', 'moni-snackbar'].includes(component.tag) && scenario.prop.name !== 'open') attrs.push('open');
  return `<${component.tag} ${attrs.join(' ')}>${children[component.tag] ?? ''}</${component.tag}>`;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 960, height: 720 }, deviceScaleFactor: 1 });
await page.setContent('<!doctype html><html><body><main id="stage"></main></body></html>');
await page.addStyleTag({ path: browserStyles });
const symbolFont = fs.readFileSync(path.join(root, 'dist', 'assets', 'material-symbols-rounded.woff2')).toString('base64');
await page.addStyleTag({ content: `@font-face{font-family:'Material Symbols Rounded';src:url(data:font/woff2;base64,${symbolFont}) format('woff2');font-style:normal;font-weight:100 700}html{color-scheme:light}body{margin:0;background:#f8f7ff;color:#1d1b20;font-family:Arial,sans-serif}#stage{box-sizing:border-box;min-height:720px;padding:72px;display:grid;place-items:center;overflow:visible}#stage>*,#stage>div{max-width:760px}moni-dialog,moni-bottom-sheet,moni-side-sheet,moni-morph-modal{position:relative!important}` });
await page.addScriptTag({ path: browserScript });

let count = 0;
for (const component of api.components.filter((item) => !componentFilter || item.tag === componentFilter)) {
  const dir = path.join(assets, component.tag);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const scenario of scenarios(component)) {
    const file = path.join(dir, `${scenario.prop.name}--${safe(scenario.key)}.png`);
    await page.locator('#stage').evaluate((stage, html) => { stage.innerHTML = html; }, markup(component, scenario));
    await page.waitForTimeout(120);
    await page.locator('#stage').screenshot({ path: file });
    count++;
  }
}
await browser.close();
console.log(`Captured ${count} visual API scenarios for ${api.components.length} components.`);
