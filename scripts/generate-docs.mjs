import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { visualSafeName, visualValues } from './docs-visuals.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'src', 'components');
const docsDir = path.join(root, 'docs');
const componentsDir = path.join(docsDir, 'components');
const checkOnly = process.argv.includes('--check');

const clean = (value = '') => value.trim();
const slug = (tag) => tag.replace(/^moni-/, '');
const escapeCell = (value) => String(value ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const code = (value) => `\`${String(value ?? '—').replace(/`/g, '\\`')}\``;
const getDecorators = (node) => ts.canHaveDecorators(node) ? ts.getDecorators(node) ?? [] : [];
const expressionText = (node, source) => node ? node.getText(source) : undefined;

const propertyVocabulary = {
  active: 'Indica si el elemento está activo.', checked: 'Estado seleccionado del control.', disabled: 'Impide la interacción y aplica el estado visual deshabilitado.',
  icon: 'Nombre de Material Symbol mostrado por el componente.', label: 'Etiqueta visible y accesible del control.', loading: 'Muestra el estado de carga y evita acciones duplicadas.',
  name: 'Nombre enviado junto al valor cuando participa en un formulario.', open: 'Controla si la superficie superpuesta está abierta.', placeholder: 'Texto de ayuda mostrado mientras el campo está vacío.',
  required: 'Marca el control como obligatorio para la validación del formulario.', selected: 'Indica si la opción está seleccionada.', size: 'Selecciona uno de los tamaños visuales admitidos.',
  value: 'Valor actual del control; usa la propiedad JavaScript para valores que deban conservar su tipo.', variant: 'Selecciona la variante visual y su nivel de énfasis.',
};

function inferredDescription(name, type) {
  if (propertyVocabulary[name]) return propertyVocabulary[name];
  if (type === 'boolean') return `Activa o desactiva el comportamiento \`${name}\`. En HTML, la presencia del atributo significa \`true\`; omítelo para \`false\`.`;
  if (/^'[^']+'(?:\s*\|\s*'[^']+')+$/.test(type)) return `Selecciona el valor de \`${name}\` entre las opciones documentadas.`;
  return `Define \`${name}\`. Conserva el tipo indicado y usa la propiedad JavaScript cuando el valor no sea una cadena.`;
}

function jsDoc(node) {
  const docs = node.jsDoc ?? [];
  return clean(docs.map((doc) => doc.comment ?? '').join('\n'));
}

function jsDocTag(node, name) {
  for (const doc of node.jsDoc ?? []) {
    for (const tag of doc.tags ?? []) if (tag.tagName.text === name) return clean(String(tag.comment ?? ''));
  }
  return '';
}

function literalOptions(typeNode) {
  if (!typeNode || !ts.isUnionTypeNode(typeNode)) return [];
  return typeNode.types.flatMap((part) => ts.isLiteralTypeNode(part) && ts.isStringLiteral(part.literal) ? [part.literal.text] : []);
}

function inferredType(member, config, source) {
  if (member.type) return member.type.getText(source).replace(/\s+/g, ' ').trim().replace(/^\|\s*/, '');
  if (config.type) return config.type.getText(source).replace(/^Boolean$/, 'boolean').replace(/^Number$/, 'number').replace(/^String$/, 'string');
  const value = member.initializer;
  if (value && ts.isStringLiteral(value)) return 'string';
  if (value && ts.isNumericLiteral(value)) return 'number';
  if (value?.kind === ts.SyntaxKind.TrueKeyword || value?.kind === ts.SyntaxKind.FalseKeyword) return 'boolean';
  return 'unknown';
}

function propertyDecorator(node, source) {
  const decorator = getDecorators(node).find((item) => {
    const expression = item.expression;
    return ts.isCallExpression(expression) && expression.expression.getText(source) === 'property';
  });
  if (!decorator || !ts.isCallExpression(decorator.expression)) return null;
  const argument = decorator.expression.arguments[0];
  const config = {};
  if (argument && ts.isObjectLiteralExpression(argument)) {
    for (const prop of argument.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const name = prop.name.getText(source).replace(/["']/g, '');
      config[name] = prop.initializer;
    }
  }
  return config;
}

function attrName(name, config, source) {
  if (config.attribute) {
    if (config.attribute.kind === ts.SyntaxKind.FalseKeyword) return null;
    if (ts.isStringLiteral(config.attribute)) return config.attribute.text;
  }
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function extractComponent(file) {
  const sourceText = fs.readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let result;
  source.forEachChild((node) => {
    if (!ts.isClassDeclaration(node)) return;
    const custom = getDecorators(node).find((item) => {
      const expression = item.expression;
      return ts.isCallExpression(expression) && expression.expression.getText(source) === 'customElement';
    });
    if (!custom || !ts.isCallExpression(custom.expression)) return;
    const tagArg = custom.expression.arguments[0];
    if (!tagArg || !ts.isStringLiteral(tagArg)) return;
    const properties = [];
    const methods = [];
    for (const member of node.members) {
      if (ts.isPropertyDeclaration(member) && member.name) {
        const config = propertyDecorator(member, source);
        if (!config) continue;
        const name = member.name.getText(source);
        const type = inferredType(member, config, source);
        properties.push({
          name,
          attribute: attrName(name, config, source),
          type,
          default: expressionText(member.initializer, source),
          description: jsDoc(member) || inferredDescription(name, type),
          options: literalOptions(member.type),
          reflect: config.reflect?.kind === ts.SyntaxKind.TrueKeyword,
        });
      }
      if (ts.isMethodDeclaration(member) && member.name && !member.modifiers?.some((m) => m.kind === ts.SyntaxKind.PrivateKeyword || m.kind === ts.SyntaxKind.ProtectedKeyword)) {
        const name = member.name.getText(source);
        if (!name.startsWith('_') && name !== 'render' && name !== 'connectedCallback' && name !== 'disconnectedCallback' && name !== 'firstUpdated' && name !== 'updated' && name !== 'willUpdate') {
          methods.push({ name, signature: member.getText(source).split('{')[0].trim(), description: jsDoc(member) || `Método público ${name}.` });
        }
      }
    }
    const events = [...new Set([...sourceText.matchAll(/new CustomEvent\(\s*['"]([^'"]+)['"]/g)].map((m) => m[1]))].map((name) => ({ name }));
    const cssProperties = [...new Set([...sourceText.matchAll(/var\(\s*(--[a-z0-9-_]+)/gi)].map((m) => m[1]))].sort();
    const cssParts = [...new Set([...sourceText.matchAll(/\bpart=["']([^"']+)["']/g)].flatMap((m) => m[1].split(/\s+/)))].sort();
    const classDocs = node.jsDoc ?? [];
    const tags = classDocs.flatMap((doc) => [...(doc.tags ?? [])]);
    const slots = tags.filter((tag) => tag.tagName.text === 'slot').map((tag) => {
      const value = clean(String(tag.comment ?? ''));
      const match = value.match(/^(\S+?)(?:\s+-\s+|\s+)(.*)$/s);
      return { name: match?.[1] === 'default' ? 'default' : match?.[1] ?? 'default', description: match?.[2] ?? value };
    });
    const docParts = tags.filter((tag) => tag.tagName.text === 'csspart').map((tag) => {
      const value = clean(String(tag.comment ?? ''));
      const match = value.match(/^(\S+?)(?:\s+-\s+|\s+)(.*)$/s);
      return { name: match?.[1] ?? value, description: match?.[2] ?? '' };
    });
    const examples = tags.filter((tag) => tag.tagName.text === 'example').map((tag) => clean(String(tag.comment ?? '')));
    result = {
      tag: tagArg.text,
      className: node.name?.text ?? '',
      source: path.relative(root, file).replace(/\\/g, '/'),
      description: jsDoc(node) || `Componente ${tagArg.text} de Moni UI.`,
      properties,
      methods,
      events,
      slots,
      cssParts: [...new Map([...docParts, ...cssParts.map((name) => ({ name, description: '' }))].map((part) => [part.name, part])).values()],
      cssProperties,
      examples,
    };
  });
  return result;
}

const files = fs.readdirSync(sourceDir).filter((file) => /^moni-.*\.ts$/.test(file) && !file.endsWith('.test.ts')).sort();
const components = files.map((file) => extractComponent(path.join(sourceDir, file))).filter(Boolean).sort((a, b) => a.tag.localeCompare(b.tag));

function fallbackExample(component) {
  const textTags = new Set(['moni-button', 'moni-chip', 'moni-typography', 'moni-tooltip', 'moni-tab', 'moni-menu-item', 'moni-nav-item', 'moni-list-item', 'moni-step']);
  return `<${component.tag}>${textTags.has(component.tag) ? 'Ejemplo' : ''}</${component.tag}>`;
}

function practicalExample(component) {
  const inner = {
    'moni-button': 'Guardar cambios', 'moni-chip': 'Accesibilidad', 'moni-tab': 'Resumen',
    'moni-tooltip': '<moni-button icon="info" aria-label="Más información"></moni-button>',
    'moni-card': '<h2 class="text-xl font-semibold">Proyecto Aurora</h2>\n  <p class="text-sm opacity-70">Actualizado hace 5 minutos</p>',
  }[component.tag] ?? (component.examples[0] ? '' : (['moni-typography', 'moni-menu-item', 'moni-nav-item', 'moni-list-item', 'moni-step'].includes(component.tag) ? 'Contenido' : ''));
  return `<div class="mx-auto flex w-full max-w-md flex-col gap-4 p-6">\n  <${component.tag}${component.properties.some((p) => p.name === 'label') ? ' label="Ejemplo"' : ''}>${inner}</${component.tag}>\n</div>`;
}

function recommendations(component) {
  const names = new Set(component.properties.map((prop) => prop.name));
  const items = [
    `Usa \`${component.tag}\` para su propósito semántico; no lo sustituyas por un \`div\` estilizado.`,
    'Aplica Tailwind al layout exterior. Para el interior del Shadow DOM usa las variables CSS y `::part()` documentados.',
  ];
  if (names.has('disabled')) items.push('Durante una operación asíncrona combina el estado `loading` —si existe— con `disabled` para evitar envíos duplicados.');
  if (names.has('value')) items.push('En formularios controlados, sincroniza la propiedad `value` y escucha el evento documentado; no dependas solo del atributo inicial.');
  if (names.has('icon')) items.push('Cuando el control muestre únicamente un icono, añade siempre un `aria-label` descriptivo.');
  if (names.has('open') || names.has('active')) items.push('Mantén el estado de apertura en una única fuente de verdad y devuelve el foco al disparador al cerrar.');
  items.push('Prueba los estados claro, oscuro, foco por teclado, deshabilitado y viewport móvil antes de publicar.');
  return items;
}

function markdown(component) {
  const title = component.tag.replace('moni-', '').split('-').map((word) => word[0].toUpperCase() + word.slice(1)).join(' ');
  const propertyRows = component.properties.map((prop) => `| ${code(prop.attribute)} | ${code(prop.name)} | ${escapeCell(code(prop.type))} | ${escapeCell(code(prop.default))} | ${escapeCell(prop.description)} |`).join('\n') || '| — | — | — | — | Sin propiedades públicas. |';
  const visualSections = component.properties.map((prop) => {
    const values = visualValues(component, prop, 'default');
    if (!values.length) return '';
    const images = values.map((value) => `![${component.tag} — ${prop.attribute ?? prop.name}=${value}](../assets/${component.tag}/${prop.name}--${visualSafeName(value)}.png)`).join('\n\n');
    return `### ${code(prop.attribute ?? prop.name)}\n\n${prop.description}\n\n${images}`;
  }).filter(Boolean).join('\n\n');
  const rawExample = component.examples[0] || fallbackExample(component);
  const example = rawExample.startsWith('```') ? rawExample : `\`\`\`html\n${rawExample}\n\`\`\``;
  const tips = recommendations(component).map((item) => `- ${item}`).join('\n');
  return `# ${title}\n\n${component.description}\n\n- Tag: ${code(component.tag)}\n- Clase: ${code(component.className)}\n- Fuente: ${code(component.source)}\n\n## Cuándo usarlo\n\nUsa ${code(component.tag)} cuando la interfaz necesite el patrón que describe este componente. Antes de elegirlo, revisa sus estados, contenido permitido y comportamiento accesible; las capturas del final muestran el resultado real de cada variante.\n\n## Uso básico\n\n${example}\n\n## Ejemplo práctico con Tailwind CSS v4\n\nTailwind controla composición, ancho, espaciado y responsividad alrededor del Web Component. Moni UI conserva el aspecto interno mediante Shadow DOM y design tokens.\n\n\`\`\`html\n${practicalExample(component)}\n\`\`\`\n\nNo necesitas un plugin de Tailwind. En tu CSS v4 importa ambas capas una sola vez:\n\n\`\`\`css\n@import "tailwindcss";\n@import "@moni-labs/moni-ui/styles";\n\n@theme {\n  --font-sans: Inter, ui-sans-serif, system-ui, sans-serif;\n}\n\`\`\`\n\nLas utilities aplicadas directamente al tag afectan su caja anfitriona. No uses selectores Tailwind para asumir acceso al DOM interno; personaliza únicamente con los CSS Parts y Custom Properties públicos enumerados más abajo.\n\n## Recomendaciones\n\n${tips}\n\n## Propiedades y atributos\n\n| Atributo | Propiedad | Tipo | Default | Descripción |\n|---|---|---|---|---|\n${propertyRows}\n\n## Slots\n\n${component.slots.length ? component.slots.map((slot) => `- ${code(slot.name)}: ${slot.description || 'Contenido proyectado.'}`).join('\n') : 'Este componente no declara slots públicos.'}\n\n## Eventos\n\n${component.events.length ? component.events.map((event) => `- ${code(event.name)}: evento compuesto y burbujeante emitido por el componente.`).join('\n') : 'No declara eventos propios.'}\n\n## Métodos públicos\n\n${component.methods.length ? component.methods.map((method) => `- ${code(method.signature)} — ${method.description}`).join('\n') : 'No expone métodos públicos adicionales.'}\n\n## CSS Parts\n\n${component.cssParts.length ? component.cssParts.map((part) => `- ${code(part.name)}: ${part.description || 'Parte interna personalizable.'}`).join('\n') : 'No declara CSS Parts.'}\n\n## CSS Custom Properties consumidas\n\n${component.cssProperties.length ? component.cssProperties.map((name) => `- ${code(name)}`).join('\n') : 'No consume variables CSS propias.'}\n\n## Referencia visual por variable\n\nCada imagen se genera con el componente real: cambia solo la variable indicada y mantiene estable el resto del escenario. Úsala para comparar estados, no como sustituto de la API.\n\n${visualSections || 'Este componente no tiene variables visuales públicas.'}\n`;
}

const api = { package: '@moni-labs/moni-ui', generatedAt: new Date().toISOString(), componentCount: components.length, components };
const manifest = {
  schemaVersion: '1.0.0',
  readme: 'docs/README.md',
  modules: components.map((component) => ({
    kind: 'javascript-module',
    path: component.source,
    declarations: [{
      kind: 'class',
      name: component.className,
      description: component.description,
      customElement: true,
      tagName: component.tag,
      members: [
        ...component.properties.map((prop) => ({ kind: 'field', name: prop.name, ...(prop.attribute ? { attribute: prop.attribute } : {}), type: { text: prop.type }, ...(prop.default != null ? { default: prop.default } : {}), description: prop.description })),
        ...component.methods.map((method) => ({ kind: 'method', name: method.name, description: method.description })),
      ],
      events: component.events.map((event) => ({ name: event.name, type: { text: 'CustomEvent' } })),
      slots: component.slots,
      cssParts: component.cssParts,
      cssProperties: component.cssProperties.map((name) => ({ name })),
    }],
    exports: [{ kind: 'custom-element-definition', name: component.tag, declaration: { name: component.className, module: component.source } }],
  })),
};
const expected = new Map();
expected.set(path.join(root, 'custom-elements.json'), `${JSON.stringify(manifest, null, 2)}\n`);
expected.set(path.join(docsDir, 'api.json'), `${JSON.stringify(api, null, 2)}\n`);
expected.set(path.join(docsDir, 'llms.txt'), `# @moni-labs/moni-ui — índice para LLM\n\nBiblioteca de ${components.length} Web Components Material Design 3 Expressive. Importa \`@moni-labs/moni-ui\` y \`@moni-labs/moni-ui/styles\`. Consulta una ficha antes de generar markup.\n\n${components.map((c) => `- ${c.tag}: docs/components/${slug(c.tag)}.md — ${c.description.split('\n')[0]}`).join('\n')}\n`);
expected.set(path.join(docsDir, 'README.md'), `# Documentación de Moni UI\n\nDocumentación completa y legible por LLM de ${components.length} componentes.\n\n- [Índice compacto para LLM](./llms.txt)\n- [Guía de uso para LLM y agentes](./LLM-GUIDE.md)\n- [API estructurada](./api.json)\n- [Guía de publicación](./PUBLISHING.md)\n\n## Componentes\n\n${components.map((c) => `- [${c.tag}](./components/${slug(c.tag)}.md)`).join('\n')}\n\n## Regeneración\n\n\`npm run docs:all\` actualiza API, Markdown y capturas visuales.\n`);
for (const component of components) expected.set(path.join(componentsDir, `${slug(component.tag)}.md`), markdown(component));

if (checkOnly) {
  const stale = [...expected].filter(([file, content]) => !fs.existsSync(file) || fs.readFileSync(file, 'utf8').replace(/"generatedAt": ".*?"/, '"generatedAt": "<ignored>"') !== content.replace(/"generatedAt": ".*?"/, '"generatedAt": "<ignored>"')).map(([file]) => path.relative(root, file));
  const missingImages = [];
  for (const component of components) {
    for (const prop of component.properties) {
      if (!prop.attribute) continue;
      const values = visualValues(component, prop, 'default');
      for (const value of values) {
        const imageName = `${prop.name}--${visualSafeName(value)}.png`;
        const image = path.join(docsDir, 'assets', component.tag, imageName);
        if (!fs.existsSync(image)) missingImages.push(path.relative(root, image));
      }
    }
  }
  if (stale.length || missingImages.length) {
    if (stale.length) console.error(`Documentation is stale:\n${stale.join('\n')}`);
    if (missingImages.length) console.error(`Visual references are missing:\n${missingImages.join('\n')}`);
    process.exit(1);
  }
  console.log(`Documentation is current for ${components.length} components.`);
} else {
  fs.mkdirSync(componentsDir, { recursive: true });
  for (const [file, content] of expected) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, content); }
  console.log(`Generated documentation for ${components.length} components.`);
}
