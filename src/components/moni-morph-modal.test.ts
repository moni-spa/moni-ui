import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import './moni-morph-modal.js';
import type { MoniMorphModal } from './moni-morph-modal.js';

vi.mock('gsap', () => {
	return {
		gsap: {
			registerPlugin: vi.fn(),
			set: vi.fn(),
			fromTo: vi.fn(
				(_target: unknown, _from: object, to: { onComplete?: () => void }) => {
					if (to.onComplete) to.onComplete();
					return { then: vi.fn((cb: () => void) => cb()) };
				}
			),
			to: vi.fn((_target: unknown, config: { onComplete?: () => void }) => {
				if (config.onComplete) config.onComplete();
				return { then: vi.fn((cb: () => void) => cb()) };
			})
		}
	};
});

vi.mock('gsap/Flip', () => {
	return {
		Flip: {
			getState: vi.fn(() => ({})),
			from: vi.fn(
				(_state: unknown, config: { onComplete?: () => void }) => {
					if (config.onComplete) config.onComplete();
					return {};
				}
			)
		}
	};
});

async function waitForRaf() {
	await new Promise((resolve) => requestAnimationFrame(resolve));
	await new Promise((resolve) => requestAnimationFrame(resolve));
}

describe('moni-morph-modal', () => {
	let el: MoniMorphModal;
	let target: HTMLButtonElement;
	let originalMatchMedia: typeof window.matchMedia;

	beforeEach(() => {
		originalMatchMedia = window.matchMedia;
		window.matchMedia = vi.fn().mockImplementation((query: string) => ({
			matches: query === '(prefers-reduced-motion: reduce)' ? false : false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn()
		})) as unknown as typeof window.matchMedia;

		target = document.createElement('button');
		target.id = 'test-target';
		target.textContent = 'Open';
		document.body.appendChild(target);

		el = document.createElement('moni-morph-modal') as MoniMorphModal;
		el.target = '#test-target';
		document.body.appendChild(el);
	});

	afterEach(() => {
		window.matchMedia = originalMatchMedia;
		el.remove();
		target.remove();
	});

	it('registra el elemento personalizado', () => {
		expect(customElements.get('moni-morph-modal')).toBeTruthy();
	});

	it('renderiza un panel y un backdrop en el shadow root', async () => {
		await el.updateComplete;
		const panel = el.shadowRoot?.querySelector('.panel');
		const backdrop = el.shadowRoot?.querySelector('.backdrop');
		expect(panel).toBeTruthy();
		expect(backdrop).toBeTruthy();
	});

	it('refleja el atributo target', async () => {
		await el.updateComplete;
		expect(el.getAttribute('target')).toBe('#test-target');
	});

	it('refleja el atributo open', async () => {
		el.open = true;
		await el.updateComplete;
		expect(el.hasAttribute('open')).toBe(true);
	});

	it('proyecta el contenido del slot por defecto', async () => {
		const content = document.createElement('p');
		content.textContent = 'Hello';
		el.appendChild(content);
		await el.updateComplete;
		const body = el.shadowRoot?.querySelector('.body');
		expect(body).toBeTruthy();
		const slot = body?.querySelector('slot');
		expect(slot).toBeTruthy();
	});

	it('proyecta el contenido del slot header', async () => {
		const header = document.createElement('div');
		header.setAttribute('slot', 'header');
		header.textContent = 'Title';
		el.appendChild(header);
		await el.updateComplete;
		const headerSlot = el.shadowRoot?.querySelector('slot[name="header"]');
		expect(headerSlot).toBeTruthy();
	});

	it('proyecta el contenido del slot footer', async () => {
		const footer = document.createElement('div');
		footer.setAttribute('slot', 'footer');
		footer.textContent = 'Actions';
		el.appendChild(footer);
		await el.updateComplete;
		const footerSlot = el.shadowRoot?.querySelector('slot[name="footer"]');
		expect(footerSlot).toBeTruthy();
	});

	it('muestra el botón de cerrar cuando show-close-button es true', async () => {
		el.showCloseButton = true;
		await el.updateComplete;
		const closeBtn = el.shadowRoot?.querySelector('.close-btn');
		expect(closeBtn).toBeTruthy();
	});

	it('alterna el estado open cuando se llaman a show() y hide()', async () => {
		expect(el.open).toBe(false);
		el.show();
		await waitForRaf();
		expect(el.open).toBe(true);
		el.hide();
		await waitForRaf();
		expect(el.open).toBe(false);
	});

	it('alterna el estado open cuando se llama a toggle()', async () => {
		el.toggle();
		await waitForRaf();
		expect(el.open).toBe(true);
		el.toggle();
		await waitForRaf();
		expect(el.open).toBe(false);
	});

	it('advierte cuando no se encuentra el objetivo (target)', () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
		const modal = document.createElement('moni-morph-modal') as MoniMorphModal;
		modal.target = '#missing-target';
		document.body.appendChild(modal);
		const call = warnSpy.mock.calls.find((c) =>
			String(c[0]).includes('[moni-morph-modal]')
		);
		expect(call).toBeTruthy();
		modal.remove();
		warnSpy.mockRestore();
	});

	it('soporta la declaración recursiva de modales morph anidados', async () => {
		const innerTarget = document.createElement('button');
		innerTarget.id = 'inner-target';
		el.appendChild(innerTarget);

		const innerModal = document.createElement('moni-morph-modal') as MoniMorphModal;
		innerModal.target = '#inner-target';
		el.appendChild(innerModal);

		await el.updateComplete;
		await innerModal.updateComplete;

		expect(innerModal.target).toBe('#inner-target');
		innerModal.show();
		await waitForRaf();
		expect(innerModal.open).toBe(true);

		innerModal.remove();
		innerTarget.remove();
	});

	it('no crea elementos morph por defecto', async () => {
		el.show();
		await waitForRaf();
		expect(el.shadowRoot?.querySelector('.morph-text')).toBeFalsy();
		expect(el.shadowRoot?.querySelector('.morph-icon')).toBeFalsy();
	});

	it('crea y limpia morph-text cuando morph-label es true', async () => {
		(el as unknown as { _hasHeader: boolean })._hasHeader = true;
		el.morphLabel = true;
		await el.updateComplete;

		const createSpy = vi.spyOn(
			el as unknown as { _createMorphText: (text: string, source: Element) => HTMLElement },
			'_createMorphText'
		);
		el.show();
		await waitForRaf();

		expect(createSpy).toHaveBeenCalled();
		expect(el.shadowRoot?.querySelector('.morph-text')).toBeFalsy();
		createSpy.mockRestore();
	});

	it('usa el contenido del slot trigger-label cuando se proporciona', async () => {
		const triggerLabel = document.createElement('span');
		triggerLabel.setAttribute('slot', 'trigger-label');
		triggerLabel.textContent = 'Custom label';
		el.appendChild(triggerLabel);

		(el as unknown as { _hasHeader: boolean })._hasHeader = true;
		(el as unknown as { _hasTriggerLabel: boolean })._hasTriggerLabel = true;

		el.morphLabel = true;
		await el.updateComplete;

		const getNodes = vi.spyOn(
			el as unknown as { _getTriggerLabelNodes: () => Node[] },
			'_getTriggerLabelNodes'
		);
		el.show();
		await waitForRaf();

		expect(getNodes).toHaveReturned();
		const returned = getNodes.mock.results[0]?.value as Node[] | undefined;
		expect(returned?.length).toBeGreaterThan(0);
		getNodes.mockRestore();
	});

	it('ejecuta la animación FLIP de label al cerrar cuando morph-label es true', async () => {
		(el as unknown as { _hasHeader: boolean })._hasHeader = true;
		el.morphLabel = true;
		await el.updateComplete;

		el.show();
		await waitForRaf();
		expect(el.open).toBe(true);

		const closeSpy = vi.spyOn(
			el as unknown as { _animateLabelClose: () => void },
			'_animateLabelClose'
		);
		el.hide();
		await waitForRaf();

		expect(closeSpy).toHaveBeenCalled();
		closeSpy.mockRestore();
	});

	it('no crea elementos morph cuando se prefiere movimiento reducido (reduced motion)', async () => {
		(el as unknown as { _hasHeader: boolean })._hasHeader = true;
		el.morphLabel = true;
		await el.updateComplete;

		window.matchMedia = vi.fn().mockReturnValue({
			matches: true,
			media: '(prefers-reduced-motion: reduce)',
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn()
		} as unknown as MediaQueryList);

		const createSpy = vi.spyOn(
			el as unknown as { _createMorphText: (text: string, source: Element) => HTMLElement },
			'_createMorphText'
		);
		el.show();
		await waitForRaf();

		expect(createSpy).not.toHaveBeenCalled();
		createSpy.mockRestore();
	});
});
