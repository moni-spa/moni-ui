import { describe, expect, it } from 'vitest';
import './index.js';

const publicElements = [
	'moni-app-bar', 'moni-badge', 'moni-bottom-sheet', 'moni-button',
	'moni-button-group', 'moni-button-segment', 'moni-card', 'moni-carousel',
	'moni-checkbox', 'moni-chip', 'moni-color-field', 'moni-context-menu',
	'moni-dialog', 'moni-divider', 'moni-expansion', 'moni-fab', 'moni-fab-menu',
	'moni-file-field', 'moni-icon', 'moni-list', 'moni-list-item',
	'moni-loading-indicator', 'moni-menu', 'moni-menu-item', 'moni-morph-modal',
	'moni-nav', 'moni-nav-item', 'moni-progress', 'moni-radio', 'moni-ripple',
	'moni-segmented-button', 'moni-select', 'moni-select-option', 'moni-shape',
	'moni-side-sheet', 'moni-slider', 'moni-snackbar', 'moni-split-button',
	'moni-step', 'moni-stepper', 'moni-switch', 'moni-tab', 'moni-tabs',
	'moni-text-field', 'moni-textarea', 'moni-time-picker', 'moni-toolbar',
	'moni-tooltip', 'moni-typography'
] as const;

describe('full component entry', () => {
	it('registers every documented public custom element', () => {
		expect(publicElements).toHaveLength(49);
		for (const tag of publicElements) expect(customElements.get(tag), tag).toBeDefined();
	});
});
