import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { gsap } from 'gsap';
import './moni-morph-modal.js';
import './moni-fab.js';
import './moni-fab-menu.js';
import type { MoniMorphModal } from './moni-morph-modal.js';

vi.mock('gsap', () => {
	return {
		gsap: {
			registerPlugin: vi.fn(),
			utils: {
				interpolate: vi.fn((_start: unknown, end: unknown) => end)
			},
			set: vi.fn(),
			timeline: vi.fn((config: { onComplete?: () => void } = {}) => {
				const timeline = {
					addLabel: vi.fn(() => timeline),
					to: vi.fn((target: Record<string, unknown>, vars: Record<string, unknown>) => {
						if (typeof vars.onStart === 'function') (vars.onStart as () => void)();
						if (typeof vars.progress === 'number') target.progress = vars.progress;
						if (typeof vars.onUpdate === 'function') (vars.onUpdate as () => void)();
						return timeline;
					})
				};
				queueMicrotask(() => config.onComplete?.());
				return timeline;
			}),
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
		target.getBoundingClientRect = () => new DOMRect(24, 700, 56, 56);
		document.body.appendChild(target);

		el = document.createElement('moni-morph-modal') as MoniMorphModal;
		el.target = '#test-target';
		document.body.appendChild(el);
	});

	afterEach(() => {
		window.matchMedia = originalMatchMedia;
		el.remove();
		target.remove();
		document.documentElement.style.overflow = '';
		document.body.style.overflow = '';
		document.body.style.overscrollBehavior = '';
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

	it('ocupa todo el viewport cuando fullscreen está activo', async () => {
		el.fullscreen = true;
		await el.updateComplete;
		const rect = (el as unknown as { _computeFinalRect: (target: DOMRect) => DOMRect })
			._computeFinalRect(new DOMRect(24, 700, 56, 56));

		expect(el.hasAttribute('fullscreen')).toBe(true);
		expect(rect.x).toBe(0);
		expect(rect.y).toBe(0);
		expect(rect.width).toBe(window.innerWidth);
		expect(rect.height).toBe(window.innerHeight);
		expect(el.shadowRoot?.querySelector('.panel')?.classList.contains('fullscreen')).toBe(true);
	});

	it('aplica fullscreen responsive sólo bajo el breakpoint', () => {
		el.responsiveFullscreen = true;
		el.fullscreenBreakpoint = 600;
		const usesFullscreen = () => (el as unknown as { _usesFullscreen: () => boolean })._usesFullscreen();

		vi.stubGlobal('innerWidth', 480);
		expect(usesFullscreen()).toBe(true);
		vi.stubGlobal('innerWidth', 900);
		expect(usesFullscreen()).toBe(false);
		vi.unstubAllGlobals();
	});

	it('auto-height usa la altura natural sin superar expanded-height', () => {
		el.autoHeight = true;
		el.expandedHeight = '600px';
		const compute = (naturalHeight: number) =>
			(el as unknown as {
				_computeFinalRect: (target: DOMRect, natural: { width: number; height: number }) => DOMRect;
			})._computeFinalRect(new DOMRect(24, 100, 56, 56), { width: 400, height: naturalHeight });

		expect(compute(360).height).toBe(360);
		expect(compute(900).height).toBe(600);
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

	it('bloquea el scroll del documento con backdrop y lo restaura al cerrar', async () => {
		document.documentElement.style.overflow = 'auto';
		document.body.style.overflow = 'scroll';
		el.hasBackdrop = true;

		el.show();
		await waitForRaf();
		expect(document.documentElement.style.overflow).toBe('hidden');
		expect(document.body.style.overflow).toBe('hidden');

		el.hide();
		await waitForRaf();
		expect(document.documentElement.style.overflow).toBe('auto');
		expect(document.body.style.overflow).toBe('scroll');
	});

	it('mantiene bloqueado el scroll hasta cerrar el último morph modal', async () => {
		const secondTarget = document.createElement('button');
		secondTarget.id = 'second-target';
		secondTarget.getBoundingClientRect = () => new DOMRect(100, 100, 56, 56);
		document.body.appendChild(secondTarget);
		const second = document.createElement('moni-morph-modal') as MoniMorphModal;
		second.target = '#second-target';
		document.body.appendChild(second);

		el.show();
		second.show();
		await waitForRaf();
		el.hide();
		await waitForRaf();
		expect(document.body.style.overflow).toBe('hidden');

		second.hide();
		await waitForRaf();
		expect(document.body.style.overflow).toBe('');
		second.remove();
		secondTarget.remove();
	});

	it('desenfoca el contenido mientras desaparece al cerrar', async () => {
		el.show();
		await waitForRaf();
		vi.mocked(gsap.fromTo).mockClear();

		el.hide();
		await waitForRaf();

		expect(gsap.fromTo).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ opacity: 1, filter: 'blur(0px)' }),
			expect.objectContaining({ opacity: 0, filter: 'blur(6px)' })
		);
	});

	it('recalcula la posición actual del origen al cerrar', async () => {
		el.show();
		await waitForRaf();
		target.getBoundingClientRect = () => new DOMRect(310, 420, 64, 48);

		el.hide();
		await waitForRaf();

		const panel = el.shadowRoot?.querySelector('.panel') as HTMLElement;
		expect(gsap.set).toHaveBeenCalledWith(
			panel,
			expect.objectContaining({ x: 310, y: 420 })
		);
		expect(panel.style.width).toBe('64px');
		expect(panel.style.height).toBe('48px');
	});

	it('desaparece con escala y opacidad cuando el origen ya no existe', async () => {
		el.show();
		await waitForRaf();
		target.remove();
		vi.mocked(gsap.to).mockClear();

		el.hide();
		await waitForRaf();

		expect(gsap.to).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ autoAlpha: 0, scale: 0.92 })
		);
		expect(el.open).toBe(false);
	});

	it('usa el cierre sin origen cuando el target salio del viewport', async () => {
		const visibleAncestor = document.createElement('div');
		visibleAncestor.getBoundingClientRect = () => new DOMRect(0, 0, 320, 480);
		document.body.appendChild(visibleAncestor);
		visibleAncestor.appendChild(target);

		el.show();
		await waitForRaf();
		target.getBoundingClientRect = () =>
			new DOMRect(24, window.innerHeight + 100, 56, 56);
		vi.mocked(gsap.to).mockClear();

		el.hide();
		await waitForRaf();

		expect(gsap.to).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ autoAlpha: 0, scale: 0.92 })
		);
		expect(el.open).toBe(false);
		visibleAncestor.remove();
	});

	it('captura la superficie interna real de un FAB para el morph', async () => {
		const fab = document.createElement('moni-fab');
		document.body.appendChild(fab);
		await (fab as HTMLElement & { updateComplete: Promise<unknown> }).updateComplete;
		const button = fab.shadowRoot?.querySelector('button') as HTMLButtonElement;
		button.style.backgroundColor = 'rgb(103, 80, 164)';
		button.style.borderRadius = '20px';
		button.style.boxShadow = 'rgba(0, 0, 0, 0.2) 0px 2px 6px';
		button.getBoundingClientRect = () => new DOMRect(280, 640, 56, 56);

		const state = (el as unknown as {
			_getTargetState: (target: HTMLElement) => {
				rect: DOMRect;
				backgroundColor: string;
				borderRadius: string;
				boxShadow: string;
			};
		})._getTargetState(fab);

		expect(state.rect.x).toBe(280);
		expect(state.rect.width).toBe(56);
		expect(state.backgroundColor).toBe('rgb(103, 80, 164)');
		expect(state.borderRadius).toBe('20px');
		expect(state.boxShadow).toContain('2px 6px');
		fab.remove();
	});

	it('captura todo el contenido compuesto del trigger interno de un FAB Menu', async () => {
		const menu = document.createElement('moni-fab-menu') as HTMLElement & {
			icon: string;
			updateComplete: Promise<unknown>;
		};
		menu.icon = 'add';
		document.body.appendChild(menu);
		await menu.updateComplete;
		const trigger = menu.shadowRoot?.querySelector('.trigger') as HTMLElement & { updateComplete: Promise<unknown> };
		await trigger.updateComplete;

		const visual = (el as unknown as {
			_resolveVisualTarget: (target: HTMLElement) => HTMLElement;
		})._resolveVisualTarget(menu);
		visual.getBoundingClientRect = () => new DOMRect(20, 30, 56, 56);
		const snapshot = (el as unknown as {
			_createTargetSnapshot: (target: HTMLElement, rect: DOMRect) => HTMLElement;
		})._createTargetSnapshot(visual, visual.getBoundingClientRect());

		expect(snapshot.textContent).toContain('add');
		expect(snapshot.style.width).toBe('56px');
		expect(snapshot.querySelectorAll('*').length).toBeGreaterThan(1);
		expect((snapshot.firstElementChild as HTMLElement).style.backgroundColor).toBe('transparent');
		expect((snapshot.firstElementChild as HTMLElement).style.transform).toBe('none');
		expect((snapshot.firstElementChild as HTMLElement).style.whiteSpace).toBe('nowrap');
		menu.remove();
	});

	it('carga inmediatamente las imágenes incluidas en el snapshot', () => {
		const card = document.createElement('button');
		const image = document.createElement('img');
		image.loading = 'lazy';
		image.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
		card.appendChild(image);
		const snapshot = (el as unknown as {
			_createTargetSnapshot: (target: HTMLElement, rect: DOMRect) => HTMLElement;
		})._createTargetSnapshot(card, new DOMRect(0, 0, 240, 140));

		expect(snapshot.querySelector('img')?.loading).toBe('eager');
		expect(snapshot.querySelector('img')?.decoding).toBe('sync');
	});

	it('descompone rotación y escala del transform vivo del target', () => {
		const transformed = document.createElement('button');
		transformed.style.transform = 'matrix(1.195128, 0.104587, -0.104587, 1.195128, 80, 0)';
		document.body.appendChild(transformed);
		const state = (el as unknown as {
			_readTransformState: (target: HTMLElement) => { rotation: number; scaleX: number; scaleY: number };
		})._readTransformState(transformed);

		expect(state.rotation).toBeCloseTo(5, 1);
		expect(state.scaleX).toBeCloseTo(1.2, 1);
		expect(state.scaleY).toBeCloseTo(1.2, 1);
		transformed.remove();
	});

	it('convierte coordenadas del viewport al canvas transformado', () => {
		const canvas = document.createElement('div');
		canvas.className = 'lab-canvas';
		canvas.style.transform = 'scale(0.5)';
		canvas.getBoundingClientRect = () => new DOMRect(10, 20, 200, 300);
		document.body.appendChild(canvas);
		canvas.appendChild(el);

		const local = (el as unknown as {
			_toPanelCoordinateRect: (rect: DOMRect) => DOMRect;
		})._toPanelCoordinateRect(new DOMRect(60, 70, 20, 30));

		expect(local.x).toBe(100);
		expect(local.y).toBe(100);
		expect(local.width).toBe(40);
		expect(local.height).toBe(60);
		canvas.remove();
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
		modal.show();
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

	it('no ejecuta el morph de texto legado al cerrar cuando morph-label es true', async () => {
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

		expect(closeSpy).not.toHaveBeenCalled();
		expect(el.shadowRoot?.querySelector('.morph-text, .morph-icon, .morph-target-snapshot')).toBeNull();
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
