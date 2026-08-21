const behaviorOnly = new Set([
  'closeOnClickOutside', 'closeOnEsc', 'morphLabelSelector', 'target', 'debug',
]);

const animationOnly = new Set(['blurContent', 'coverTarget', 'hideTarget', 'morphLabel']);
const hiddenWhenFalse = new Map([
  ['moni-bottom-sheet', new Set(['open'])],
  ['moni-dialog', new Set(['open'])],
  ['moni-menu', new Set(['active'])],
  ['moni-morph-modal', new Set(['open'])],
  ['moni-side-sheet', new Set(['open'])],
  ['moni-snackbar', new Set(['active'])],
]);

export function visualValues(component, prop, fallback) {
  if (!prop.attribute || behaviorOnly.has(prop.name)) return [];
  if (component.tag === 'moni-morph-modal' && animationOnly.has(prop.name)) return [];
  const values = prop.options?.length ? prop.options : prop.type === 'boolean' ? [false, true] : [fallback];
  const hidden = hiddenWhenFalse.get(component.tag);
  return hidden?.has(prop.name) ? values.filter((value) => value === true || value === 'true') : values;
}

export const visualSafeName = (value) => String(value)
  .replace(/[^a-z0-9]+/gi, '-')
  .replace(/^-|-$/g, '')
  .toLowerCase() || 'empty';
