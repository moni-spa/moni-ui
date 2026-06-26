/**
 * @file components/moni-morph-modal.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { html, css } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { MoniElement, sharedStyles } from './_base/index.js';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import './moni-icon.js';

gsap.registerPlugin(Flip, CustomEase);

CustomEase.create('morph-open', '0.15, 0.85, 0.2, 1');
CustomEase.create('morph-close', '0.4, 0, 0.2, 1');


type Placement =
	| 'center'
	| 'top'
	| 'top-start'
	| 'top-end'
	| 'bottom'
	| 'bottom-start'
	| 'bottom-end'
	| 'left'
	| 'left-start'
	| 'left-end'
	| 'right'
	| 'right-start'
	| 'right-end'
	| 'viewport-center'
	| 'viewport-top'
	| 'viewport-bottom'
	| 'viewport-left'
	| 'viewport-right'
	| 'viewport-top-left'
	| 'viewport-top-right'
	| 'viewport-bottom-left'
	| 'viewport-bottom-right';

/**
 * Internal coordinate and styling state of the morph target before animation.
 *
 * @internal
 */
interface TargetState {
	rect: DOMRect;
	backgroundColor: string;
	color: string;
	borderRadius: string;
}

/**
 * References to the internal icon and text elements animated during the morph.
 *
 * @internal
 */
interface MorphElements {
	text: HTMLElement | null;
	icon: HTMLElement | null;
}

/**
 * Material Design 3 Morph Modal component.
 *
 * A highly interactive dialog that uses GSAP FLIP (First, Last, Invert, Play)
 * animations to seamlessly "morph" any clicked element on the page into a full
 * modal surface, and morph it back when closed.
 *
 * **Motion choreography:**
 * This component implements the complex M3 container transform pattern. When
 * triggered, the source element visually expands into the modal. The modal's
 * background color, border radius, and typography fade and cross-dissolve
 * perfectly with the origin element.
 *
 * **Triggering mechanism:**
 * Consumers must provide the `triggerEvent` property containing the original
 * pointer/click `Event` that initiated the open action. The component extracts
 * the `event.target` (or uses `clientX/Y` as a fallback) to determine the exact
 * origin coordinates for the GSAP FLIP animation.
 *
 * **Dialog behavior:**
 * Internally, it uses the native `<dialog>` element. It traps focus, supports
 * `Escape` to close, and handles scrim/backdrop clicks (which trigger the
 * reverse morph animation before actually closing the native dialog).
 *
 * @example
 * ```html
 * <moni-morph-modal id="myModal" title="Details">
 *   <p>This modal morphed from the button you just clicked.</p>
 * </moni-morph-modal>
 *
 * <moni-button id="openBtn">Open Details</moni-button>
 *
 * <script>
 *   const modal = document.getElementById('myModal');
 *   document.getElementById('openBtn').addEventListener('click', (e) => {
 *     modal.triggerEvent = e; // Pass the event so it knows where to morph from
 *     modal.open = true;
 *   });
 * </script>
 * ```
 *
 * @slot default - The main body content of the modal.
 * @slot header  - Custom header content (overrides `title` attribute).
 * @slot actions - Action buttons displayed at the bottom right.
 */

const litBool = {
	fromAttribute: (value: string | null) => value !== 'false' && value !== null,
	toAttribute: (value: boolean) => (value ? '' : null)
};

@customElement('moni-morph-modal')
export class MoniMorphModal extends MoniElement {
	@property({ reflect: true }) target = '';
	@property({ type: Boolean, reflect: true, converter: litBool }) open = false;
	@property({ type: Boolean, reflect: true, converter: litBool }) modal = true;
	@property({ reflect: true }) placement: Placement = 'center';
	@property({ reflect: true, attribute: 'expanded-width' }) expandedWidth =
		'22rem';
	@property({ reflect: true, attribute: 'expanded-height' }) expandedHeight =
		'18rem';
	@property({ type: Boolean, reflect: true, attribute: 'close-on-click-outside', converter: litBool })
	closeOnClickOutside = true;
	@property({ type: Boolean, reflect: true, attribute: 'close-on-esc', converter: litBool })
	closeOnEsc = true;
	@property({ type: Boolean, reflect: true, attribute: 'show-close-button', converter: litBool })
	showCloseButton = false;
	@property({ type: Boolean, reflect: true, attribute: 'morph-label', converter: litBool })
	morphLabel = false;
	@property({ reflect: true, attribute: 'morph-label-selector' })
	morphLabelSelector = '';
	@property({ type: Boolean, reflect: true, attribute: 'has-backdrop', converter: litBool })
	hasBackdrop = true;
	@property({ type: Boolean, reflect: true, attribute: 'hide-target', converter: litBool })
	hideTarget = false;
	@property({ type: Boolean, reflect: true, attribute: 'cover-target', converter: litBool })
	coverTarget = false;

	@query('.panel') private _panel!: HTMLDivElement;
	@query('.panel-inner') private _inner!: HTMLDivElement;
	@query('.backdrop') private _backdrop!: HTMLDivElement;
	@query('header') private _header!: HTMLElement;

	@state() private _hasHeader = false;
	@state() private _hasFooter = false;
	@state() private _hasTriggerLabel = false;

	private _targetEl: HTMLElement | null = null;
	private _isAnimating = false;
	private _visible = false;
	private _handlingOpenChange = false;
	private _zIndex = 100;
	private _morphEls: MorphElements = { text: null, icon: null };
	private static _openStack: MoniMorphModal[] = [];
	private _targetStylesCache = new Map<HTMLElement, { opacity: string; color: string }>();

	private _onTargetClick = () => this.show();
	private _onDocKeydown = (e: KeyboardEvent) => this._handleDocKeydown(e);
	private _onDocClick = (e: MouseEvent) => {
		if (!this.open || !this._visible || !this.closeOnClickOutside) return;
		if (e.composedPath().includes(this._panel)) return;
		if (this._targetEl && e.composedPath().includes(this._targetEl)) return;
		this.hide();
	};

	override connectedCallback(): void {
		super.connectedCallback();
		this._resolveTarget();
		document.addEventListener('keydown', this._onDocKeydown);
		document.addEventListener('click', this._onDocClick);
	}

	override disconnectedCallback(): void {
		document.removeEventListener('keydown', this._onDocKeydown);
		document.removeEventListener('click', this._onDocClick);
		if (this._targetEl) {
			this._targetEl.removeEventListener('click', this._onTargetClick);
		}
		const idx = MoniMorphModal._openStack.indexOf(this);
		if (idx > -1) MoniMorphModal._openStack.splice(idx, 1);
		this.style.removeProperty('z-index');
		this.style.removeProperty('--_z-index');
		this.style.removeProperty('--_backdrop-duration');
		this.style.removeProperty('--_backdrop-ease');
		this._cleanupMorphElements();
		this._restoreTargetContent();
		super.disconnectedCallback();
	}

	override updated(changed: Map<string, unknown>) {
		super.updated(changed);
		if (changed.has('target')) {
			this._resolveTarget();
		}
		if (changed.has('open') && !this._handlingOpenChange) {
			if (this.open) this.show();
			else this.hide();
		}
	}

	private _resolveTarget(): void {
		if (!this.target) return;

		const el = document.querySelector<HTMLElement>(this.target);
		if (!el) {
			console.warn(`[moni-morph-modal] target "${this.target}" not found`);
			return;
		}

		if (this._targetEl && this._targetEl !== el) {
			this._targetEl.removeEventListener('click', this._onTargetClick);
		}
		this._targetEl = el;
		this._targetEl.addEventListener('click', this._onTargetClick);
	}

	show(): void {
		if (this._isAnimating || this._visible) return;
		if (!this._targetEl) this._resolveTarget();
		if (!this._targetEl) {
			console.warn('[moni-morph-modal] cannot show: target not found');
			return;
		}

		this._isAnimating = true;
		this._handlingOpenChange = true;
		this.open = true;
		this._handlingOpenChange = false;

		MoniMorphModal._openStack.push(this);
		this._zIndex = 1000 + MoniMorphModal._openStack.length;
		this.style.zIndex = String(this._zIndex);
		this.style.setProperty('--_z-index', String(this._zIndex));
		this.style.setProperty('--_backdrop-duration', '0.38s');
		this.style.setProperty('--_backdrop-ease', 'cubic-bezier(0.15, 0.85, 0.2, 1)');

		this._hideTargetContent();

		void this.updateComplete.then(async () => {
			if (!this._targetEl || !this._panel || !this._inner) {
				this._isAnimating = false;
				return;
			}
			this._panel.classList.add('is-animating');

			await new Promise((resolve) => requestAnimationFrame(resolve));

			const targetState = this._getTargetState(this._targetEl);
			const panel = this._panel;

			this._applyRect(panel, targetState.rect);
			panel.style.backgroundColor = targetState.backgroundColor;
			panel.style.color = targetState.color;
			panel.style.borderRadius = targetState.borderRadius;
			panel.style.boxShadow = 'none';
			panel.style.zIndex = String(this._zIndex);
			panel.style.visibility = 'visible';
			panel.style.opacity = '1';
			panel.style.pointerEvents = 'auto';

			if (this._backdrop) {
				this._backdrop.style.zIndex = String(this._zIndex - 1);
			}

			this._cleanupMorphElements();
			const prefersReducedMotion = window.matchMedia(
				'(prefers-reduced-motion: reduce)'
			).matches;
			let shouldMorph = this._shouldMorphLabel() && !prefersReducedMotion;
			const morphTargets: HTMLElement[] = [];
			let source: any = null;
			const headerWrapper = this.shadowRoot!.querySelector('.header-morph-wrapper') as HTMLElement;

			if (shouldMorph) {
				this._animateLabelOpen();
				source = this._resolveMorphSource();
				if (source.text) {
					const el = this._createMorphText(source.text.content, source.text.sourceEl);
					this._positionElement(el, source.text.rect);
					morphTargets.push(el);
				}
				if (source.icon) {
					const el = this._createMorphIcon(source.icon.element);
					this._positionElement(el, source.icon.rect);
					morphTargets.push(el);
				}
				if (morphTargets.length === 0) shouldMorph = false;
			}

			if (shouldMorph && headerWrapper) {
				headerWrapper.style.opacity = '0';
			}

			const state = Flip.getState(panel, {
				props: 'backgroundColor,borderRadius,color,boxShadow'
			});
			const morphState = Flip.getState(morphTargets, {
				props: 'color,fontSize,fontWeight,lineHeight'
			});

			const finalRect = this._computeFinalRect(targetState.rect);
			panel.style.setProperty('--_panel-width', `${finalRect.width}px`);
			panel.style.setProperty('--_panel-height', `${finalRect.height}px`);
			this._applyRect(panel, finalRect);
			panel.style.backgroundColor = '';
			panel.style.color = '';
			panel.style.borderRadius = '';
			panel.style.boxShadow = '';

			if (shouldMorph && source) {
				const textRect = this._measureHeaderTextRect();
				const iconRect = this._measureHeaderIconRect();
				const headerComputed = window.getComputedStyle(this._header);

				if (this._morphEls.text && textRect) {
					this._positionElement(this._morphEls.text, textRect);
					this._morphEls.text.style.color = headerComputed.color || 'var(--on-surface)';
					this._morphEls.text.style.fontSize = headerComputed.fontSize || 'inherit';
					this._morphEls.text.style.fontWeight = headerComputed.fontWeight || 'inherit';
					this._morphEls.text.style.lineHeight = headerComputed.lineHeight || 'inherit';
				}

				if (this._morphEls.icon && iconRect) {
					this._positionElement(this._morphEls.icon, iconRect);
					this._morphEls.icon.style.color = headerComputed.color || 'var(--on-surface)';
				}
			}

			Flip.from(state, {
				targets: panel,
				duration: 0.38,
				ease: 'morph-open',
				zIndex: this._zIndex,
				onComplete: () => {
					this._isAnimating = false;
					this._visible = true;
					this._panel.classList.remove('is-animating');
					this._cleanupMorphElements();
					if (headerWrapper) headerWrapper.style.opacity = '1';
				}
			});

			if (morphTargets.length > 0) {
				Flip.from(morphState, {
					targets: morphTargets,
					duration: 0.38,
					ease: 'morph-open',
					zIndex: this._zIndex + 10
				});
			}

			const bodyChildren = Array.from(this.shadowRoot!.querySelectorAll('.body > *'));
			const fadeTargets = [
				...bodyChildren,
				this.shadowRoot!.querySelector('footer'),
				this.shadowRoot!.querySelector('.close-btn')
			].filter(Boolean) as HTMLElement[];

			gsap.set(fadeTargets, { opacity: 0, y: 8, filter: 'blur(8px)' });
			gsap.fromTo(
				fadeTargets,
				{ opacity: 0, y: 8, filter: 'blur(8px)' },
				{
					opacity: 1,
					y: 0,
					filter: 'blur(0px)',
					duration: 0.32,
					delay: 0.08,
					stagger: 0.04,
					ease: 'power2.out',
					onComplete: () => {
						gsap.set(fadeTargets, { clearProps: 'opacity,transform,filter' });
					}
				}
			);
		});
	}

	private _ensureSolidPanelBackground() {
		if (!this._panel) return;
		let bg = window.getComputedStyle(this._panel).backgroundColor;
		if (this._isColorTransparent(bg)) {
			const solidBg = this._findSolidBackground(this._panel);
			if (solidBg) {
				this._panel.style.backgroundColor = solidBg;
			} else {
				// Aseguramos un color sólido para evitar bugs de animación FLIP hacia rgba(0,0,0,0).
				// NOTA: GSAP falla si el color inline es un string con var(). Usamos un fallback seguro.
				const fallback = getComputedStyle(document.body).getPropertyValue('--surface-container-high').trim();
				this._panel.style.backgroundColor = fallback || '#2d2d2d';
			}
		}
	}

	hide(): void {
		if (this._isAnimating || !this._visible) return;
		if (!this._targetEl) return;

		this._isAnimating = true;
		this._panel.classList.add('is-animating');

		// Soluciona el caso donde el usuario no definió un fondo para .panel y lo aplicó en .body
		this._ensureSolidPanelBackground();

		this.style.setProperty('--_backdrop-duration', '0.3s');
		this.style.setProperty('--_backdrop-ease', 'cubic-bezier(0.4, 0, 0.2, 1)');

		const bodyChildren = Array.from(this.shadowRoot!.querySelectorAll('.body > *'));
		const fadeTargets = [
			...bodyChildren,
			this.shadowRoot!.querySelector('footer'),
			this.shadowRoot!.querySelector('.close-btn')
		].filter(Boolean) as HTMLElement[];
		const headerWrapper = this.shadowRoot!.querySelector('.header-morph-wrapper') as HTMLElement;

		gsap.fromTo(
			fadeTargets,
			{ opacity: 1, filter: 'blur(0px)' },
			{
				opacity: 0,
				filter: 'blur(4px)',
				duration: 0.12,
				ease: 'power2.in',
				onComplete: () => {
					const panel = this._panel;

					this._cleanupMorphElements();
					const prefersReducedMotion = window.matchMedia(
						'(prefers-reduced-motion: reduce)'
					).matches;
					let shouldMorph = this._shouldMorphLabel() && !prefersReducedMotion;
					const morphTargets: HTMLElement[] = [];
					let source: any = null;

					if (shouldMorph) {
						this._animateLabelClose();
						source = this._resolveMorphSource();
						const textRect = this._measureHeaderTextRect();
						const iconRect = this._measureHeaderIconRect();
						const headerComputed = window.getComputedStyle(this._header);

						if (source.text && textRect) {
							const el = this._createMorphText(source.text.content, source.text.sourceEl);
							this._positionElement(el, textRect);
							el.style.color = headerComputed.color || 'var(--on-surface)';
							el.style.fontSize = headerComputed.fontSize || 'inherit';
							el.style.fontWeight = headerComputed.fontWeight || 'inherit';
							el.style.lineHeight = headerComputed.lineHeight || 'inherit';
							morphTargets.push(el);
						}

						if (source.icon && iconRect) {
							const el = this._createMorphIcon(source.icon.element);
							this._positionElement(el, iconRect);
							el.style.color = headerComputed.color || 'var(--on-surface)';
							morphTargets.push(el);
						}

						if (morphTargets.length === 0) shouldMorph = false;
					}

					if (shouldMorph && headerWrapper) {
						headerWrapper.style.opacity = '0';
					}

					const state = Flip.getState(panel, {
						props: 'backgroundColor,borderRadius,color,boxShadow'
					});
					const morphState = Flip.getState(morphTargets, {
						props: 'color,fontSize,fontWeight,lineHeight'
					});

					const targetState = this._getTargetState(this._targetEl!);
					const finalRect = this._computeFinalRect(targetState.rect);
					panel.style.setProperty('--_panel-width', `${finalRect.width}px`);
					panel.style.setProperty('--_panel-height', `${finalRect.height}px`);

					this._applyRect(panel, targetState.rect);
					panel.style.backgroundColor = targetState.backgroundColor;
					panel.style.color = targetState.color;
					panel.style.borderRadius = targetState.borderRadius;
					panel.style.boxShadow = 'none';

					if (shouldMorph && source) {
						if (this._morphEls.text && source.text) {
							this._positionElement(this._morphEls.text, source.text.rect);
							this._morphEls.text.style.color =
								window.getComputedStyle(source.text.sourceEl).color || 'inherit';
							this._morphEls.text.style.fontSize =
								window.getComputedStyle(source.text.sourceEl).fontSize || 'inherit';
							this._morphEls.text.style.fontWeight =
								window.getComputedStyle(source.text.sourceEl).fontWeight || 'inherit';
							this._morphEls.text.style.lineHeight =
								window.getComputedStyle(source.text.sourceEl).lineHeight || 'inherit';
						}
						if (this._morphEls.icon && source.icon) {
							this._positionElement(this._morphEls.icon, source.icon.rect);
							this._morphEls.icon.style.color =
								window.getComputedStyle(source.icon.element).color || 'inherit';
						}
					}

					Flip.from(state, {
						targets: panel,
						duration: 0.3,
						ease: 'morph-close',
						zIndex: this._zIndex,
						onComplete: () => {
							panel.style.visibility = 'hidden';
							panel.style.opacity = '0';
							panel.style.pointerEvents = 'none';

							this._visible = false;
							this._handlingOpenChange = true;
							this.open = false;
							this._handlingOpenChange = false;
							this._isAnimating = false;
							this._panel.classList.remove('is-animating');
							this._panel.style.removeProperty('--_panel-width');
							this._panel.style.removeProperty('--_panel-height');
							this._cleanupMorphElements();
							this._restoreTargetContent();
							
							gsap.set(fadeTargets, { clearProps: 'opacity,transform,filter' });
							if (headerWrapper) headerWrapper.style.opacity = '1';
							this.style.removeProperty('z-index');
							this.style.removeProperty('--_z-index');
							this.style.removeProperty('--_backdrop-duration');
							this.style.removeProperty('--_backdrop-ease');

							const idx = MoniMorphModal._openStack.indexOf(this);
							if (idx > -1) MoniMorphModal._openStack.splice(idx, 1);
						}
					});

					if (morphTargets.length > 0) {
						Flip.from(morphState, {
							targets: morphTargets,
							duration: 0.3,
							ease: 'morph-close',
							zIndex: this._zIndex + 10
						});
					}
				}
			}
		);
	}

	toggle(): void {
		if (this._visible || this.open) this.hide();
		else this.show();
	}

	private _handleDocKeydown(e: KeyboardEvent): void {
		if (e.key !== 'Escape' || !this.closeOnEsc) return;
		const top = MoniMorphModal._openStack[MoniMorphModal._openStack.length - 1];
		if (top !== this) return;
		e.stopPropagation();
		this.hide();
	}

	private _hideTargetContent() {
		if (!this._targetEl) return;
		
		const saveAndHide = (el: HTMLElement, prop: 'opacity' | 'color') => {
			if (!this._targetStylesCache.has(el)) {
				this._targetStylesCache.set(el, { opacity: el.style.opacity, color: el.style.color });
			}
			if (prop === 'opacity') el.style.opacity = '0';
			if (prop === 'color') el.style.color = 'transparent';
		};

		if (this.hideTarget) {
			saveAndHide(this._targetEl, 'opacity');
			return;
		}

		if (this._targetEl.tagName === 'MONI-BUTTON') {
			const parts = this._getMoniButtonParts();
			if (parts.label) saveAndHide(parts.label as HTMLElement, 'opacity');
			if (parts.icon) saveAndHide(parts.icon as HTMLElement, 'opacity');
			if (parts.iconTrailing) saveAndHide(parts.iconTrailing as HTMLElement, 'opacity');
		} else {
			saveAndHide(this._targetEl, 'color');
			const icon = this._targetEl.querySelector('moni-icon, svg, [class*="icon"]');
			if (icon) saveAndHide(icon as HTMLElement, 'opacity');
		}
	}

	private _restoreTargetContent() {
		if (!this._targetEl) return;
		
		const restore = (el: HTMLElement) => {
			if (this._targetStylesCache.has(el)) {
				const cache = this._targetStylesCache.get(el)!;
				el.style.opacity = cache.opacity;
				el.style.color = cache.color;
				this._targetStylesCache.delete(el);
			}
		};

		if (this.hideTarget) {
			restore(this._targetEl);
			return;
		}

		if (this._targetEl.tagName === 'MONI-BUTTON') {
			const parts = this._getMoniButtonParts();
			if (parts.label) restore(parts.label as HTMLElement);
			if (parts.icon) restore(parts.icon as HTMLElement);
			if (parts.iconTrailing) restore(parts.iconTrailing as HTMLElement);
		} else {
			restore(this._targetEl);
			const icon = this._targetEl.querySelector('moni-icon, svg, [class*="icon"]');
			if (icon) restore(icon as HTMLElement);
		}
	}

	private _onHeaderSlotChange(e: Event): void {
		const slot = e.target as HTMLSlotElement;
		this._hasHeader = slot.assignedNodes({ flatten: true }).length > 0;
	}

	private _onFooterSlotChange(e: Event): void {
		const slot = e.target as HTMLSlotElement;
		this._hasFooter = slot.assignedNodes({ flatten: true }).length > 0;
	}

	private _onTriggerLabelSlotChange(e: Event): void {
		const slot = e.target as HTMLSlotElement;
		this._hasTriggerLabel = slot.assignedNodes({ flatten: true }).length > 0;
	}

	private _getTriggerLabelNodes(): Node[] {
		const slot = this.shadowRoot?.querySelector(
			'slot[name="trigger-label"]'
		) as HTMLSlotElement | undefined;
		return slot?.assignedNodes({ flatten: true }) ?? [];
	}

	private _shouldMorphLabel(): boolean {
		return (
			this.morphLabel && !!this._targetEl && (this._hasHeader || this._hasTriggerLabel)
		);
	}

	// =========================================================================
	// LABEL FLIP HELPERS
	// =========================================================================

	private _cleanupMorphElements(): void {
		if (this._morphEls.text) {
			this._morphEls.text.remove();
			this._morphEls.text = null;
		}
		if (this._morphEls.icon) {
			this._morphEls.icon.remove();
			this._morphEls.icon = null;
		}
	}

	private _animateLabelOpen(): void {
		// No-op: label morphing is handled by the unified FLIP timeline in show()
	}

	private _animateLabelClose(): void {
		// No-op: label morphing is handled by the unified FLIP timeline in hide()
	}

	private _createMorphText(sourceText: string, sourceEl: Element): HTMLElement {
		const el = document.createElement('div');
		el.className = 'morph-text';
		el.setAttribute('data-flip-id', `morph-text-${this.target}`);
		el.setAttribute('aria-hidden', 'true');
		el.textContent = sourceText;

		const computed = window.getComputedStyle(sourceEl);
		el.style.position = 'fixed';
		el.style.pointerEvents = 'none';
		el.style.zIndex = String(this._zIndex + 10);
		el.style.display = 'inline-flex';
		el.style.alignItems = computed.alignItems !== 'normal' ? computed.alignItems : 'center';
		el.style.justifyContent = computed.justifyContent !== 'normal' ? computed.justifyContent : 'flex-start';
		el.style.whiteSpace = 'nowrap';
		el.style.color = computed.color || 'inherit';
		el.style.fontFamily = computed.fontFamily || 'inherit';
		el.style.fontSize = computed.fontSize || 'inherit';
		el.style.fontWeight = computed.fontWeight || 'inherit';
		el.style.lineHeight = computed.lineHeight || 'inherit';
		el.style.letterSpacing = computed.letterSpacing || 'inherit';

		this.shadowRoot!.appendChild(el);
		this._morphEls.text = el;
		return el;
	}

	private _createMorphIcon(sourceIcon: Element): HTMLElement {
		const el = document.createElement('div');
		el.className = 'morph-icon';
		el.setAttribute('data-flip-id', `morph-icon-${this.target}`);
		el.setAttribute('aria-hidden', 'true');

		// Para <moni-icon> renderizamos el glifo directamente para evitar
		// esperar a que hidrate su shadow DOM.
		if (sourceIcon.tagName === 'MONI-ICON') {
			const span = document.createElement('span');
			span.textContent = sourceIcon.getAttribute('name') || '';
			const computed = window.getComputedStyle(sourceIcon);
			span.style.display = 'inline-flex';
			span.style.alignItems = 'center';
			span.style.justifyContent = 'center';
			span.style.fontFamily = computed.fontFamily || 'var(--font-icon)';
			span.style.fontSize = computed.fontSize || '1.125rem';
			span.style.inlineSize = computed.inlineSize || '1.125rem';
			span.style.blockSize = computed.blockSize || '1.125rem';
			span.style.lineHeight = '1';
			span.style.color = 'inherit';
			span.style.fontWeight = 'normal';
			span.style.fontStyle = 'normal';
			span.style.letterSpacing = 'normal';
			span.style.textTransform = 'none';
			span.style.whiteSpace = 'nowrap';
			span.style.wordWrap = 'normal';
			span.style.direction = 'ltr';
			span.style.fontFeatureSettings = "'liga'";
			span.style.fontVariationSettings =
				"'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24";
			span.style.setProperty('-webkit-font-smoothing', 'antialiased');
			el.appendChild(span);
		} else {
			el.appendChild(sourceIcon.cloneNode(true) as HTMLElement);
		}

		const computed = window.getComputedStyle(sourceIcon);
		el.style.position = 'fixed';
		el.style.pointerEvents = 'none';
		el.style.zIndex = String(this._zIndex + 10);
		el.style.display = 'inline-flex';
		el.style.alignItems = 'center';
		el.style.justifyContent = 'center';
		el.style.color = computed.color || 'inherit';
		el.style.inlineSize = computed.inlineSize || '1.125rem';
		el.style.blockSize = computed.blockSize || '1.125rem';

		this.shadowRoot!.appendChild(el);
		this._morphEls.icon = el;
		return el;
	}

	private _positionElement(el: HTMLElement, rect: DOMRect): void {
		el.style.top = `${rect.top}px`;
		el.style.left = `${rect.left}px`;
		el.style.width = `${rect.width}px`;
		el.style.height = `${rect.height}px`;
	}

	private _getMoniButtonParts(): {
		label: Element | null;
		icon: Element | null;
		iconTrailing: Element | null;
	} {
		const sr = this._targetEl?.shadowRoot;
		return {
			label: sr?.querySelector('[part="label"]') ?? null,
			icon: sr?.querySelector('[part="icon"]') ?? null,
			iconTrailing: sr?.querySelector('[part="icon-trailing"]') ?? null
		};
	}

	private _resolveMorphSource(): {
		text: { content: string; rect: DOMRect; sourceEl: Element } | null;
		icon: { element: Element; rect: DOMRect } | null;
	} {
		const result: {
			text: { content: string; rect: DOMRect; sourceEl: Element } | null;
			icon: { element: Element; rect: DOMRect } | null;
		} = { text: null, icon: null };

		if (!this._targetEl) return result;

		// Slot trigger-label tiene prioridad.
		if (this._hasTriggerLabel) {
			const nodes = this._getTriggerLabelNodes();
			if (nodes.length > 0) {
				const wrapper = document.createElement('div');
				for (const node of nodes) {
					wrapper.appendChild(node.cloneNode(true));
				}
				// Posicionamos el wrapper sobre el target para la medición inicial.
				wrapper.style.position = 'fixed';
				wrapper.style.visibility = 'hidden';
				wrapper.style.pointerEvents = 'none';
				this.shadowRoot!.appendChild(wrapper);
				const rect = this._targetEl.getBoundingClientRect();
				wrapper.remove();

				result.text = {
					content: wrapper.textContent?.trim() || '',
					rect,
					sourceEl: this._targetEl
				};
			}
			return result;
		}

		// <moni-button>: extraemos label e icono desde su shadow DOM.
		if (this._targetEl.tagName === 'MONI-BUTTON') {
			const parts = this._getMoniButtonParts();
			if (parts.label) {
				result.text = {
					content: this._targetEl.textContent?.trim() || '',
					rect: parts.label.getBoundingClientRect(),
					sourceEl: parts.label
				};
			}
			if (parts.icon) {
				const innerIcon = parts.icon.querySelector('moni-icon, svg') || parts.icon;
				result.icon = {
					element: innerIcon,
					rect: innerIcon.getBoundingClientRect()
				};
			}
			return result;
		}

		// Target arbitrario.
		let sourceEl: Element = this._targetEl;
		if (this.morphLabelSelector) {
			const selected = this._targetEl.querySelector(this.morphLabelSelector);
			if (selected) sourceEl = selected;
		}

		const text = sourceEl.textContent?.trim() || '';
		if (text) {
			result.text = {
				content: text,
				rect: sourceEl.getBoundingClientRect(),
				sourceEl
			};
		}

		// Buscamos un icono dentro del target.
		const iconEl = sourceEl.querySelector('moni-icon, svg, [class*="icon"]');
		if (iconEl) {
			result.icon = {
				element: iconEl,
				rect: iconEl.getBoundingClientRect()
			};
		}

		return result;
	}

	private _measureHeaderTextRect(): DOMRect | null {
		if (!this._header) return null;

		const slot = this.shadowRoot?.querySelector(
			'slot[name="header"]'
		) as HTMLSlotElement | undefined;
		const nodes = slot?.assignedNodes({ flatten: true }) ?? [];

		// Buscamos el primer nodo con texto visible.
		for (const node of nodes) {
			if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
				const range = document.createRange();
				range.selectNode(node);
				return range.getBoundingClientRect();
			}
			if (node.nodeType === Node.ELEMENT_NODE) {
				const el = node as Element;
				if (el.tagName === 'MONI-ICON' || el.tagName === 'SVG') {
					continue;
				}
				const childNodes = Array.from(el.childNodes);
				for (const child of childNodes) {
					if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
						const range = document.createRange();
						range.selectNode(child);
						return range.getBoundingClientRect();
					}
					if (child.nodeType === Node.ELEMENT_NODE) {
						const cel = child as Element;
						if (cel.tagName !== 'MONI-ICON' && cel.tagName !== 'SVG' && cel.textContent?.trim()) {
							return cel.getBoundingClientRect();
						}
					}
				}
				if (el.textContent?.trim()) {
					return el.getBoundingClientRect();
				}
			}
		}

		return this._header.getBoundingClientRect();
	}

	private _measureHeaderIconRect(): DOMRect | null {
		const textRect = this._measureHeaderTextRect();
		if (!textRect) return null;

		const slot = this.shadowRoot?.querySelector(
			'slot[name="header"]'
		) as HTMLSlotElement | undefined;
		const nodes = slot?.assignedNodes({ flatten: true }) ?? [];

		// Si el header ya tiene un icono, lo usamos como destino.
		for (const node of nodes) {
			if (node.nodeType === Node.ELEMENT_NODE) {
				const el = node as Element;
				if (el.tagName === 'MONI-ICON' || el.tagName === 'SVG') {
					return el.getBoundingClientRect();
				}
				const nestedIcon = el.querySelector('moni-icon, svg');
				if (nestedIcon) {
					return nestedIcon.getBoundingClientRect();
				}
			}
		}

		// Si no hay icono en el header, calculamos una posición a la
		// izquierda del texto, alineada verticalmente.
		const iconSize = 24;
		const gap = 12;
		return new DOMRect(
			textRect.left - iconSize - gap,
			textRect.top + textRect.height / 2 - iconSize / 2,
			iconSize,
			iconSize
		);
	}

	private _findSolidBackground(el: Element): string | null {
		const elements = [el, ...Array.from(el.querySelectorAll('*'))];
		for (const e of elements) {
			const bg = window.getComputedStyle(e).backgroundColor;
			if (!this._isColorTransparent(bg)) {
				return bg;
			}
		}
		// Si es un Web Component, revisamos su shadowRoot de forma superficial
		if (el.shadowRoot) {
			const shadowElements = Array.from(el.shadowRoot.querySelectorAll('*'));
			for (const e of shadowElements) {
				const bg = window.getComputedStyle(e).backgroundColor;
				if (!this._isColorTransparent(bg)) {
					return bg;
				}
			}
		}
		return null;
	}

	private _getTargetState(el: HTMLElement): TargetState {
		const rect = el.getBoundingClientRect();

		// Para <moni-button> el botón visual vive dentro del shadow DOM;
		// el host es transparente y sin border-radius, así que leemos
		// los estilos del <button> interno para que la morph coincida.
		let visualEl: Element = el;
		if (el.tagName === 'MONI-BUTTON') {
			const inner = el.shadowRoot?.querySelector('.button') as
				| HTMLElement
				| undefined;
			if (inner) visualEl = inner;
		}

		let bg = window.getComputedStyle(visualEl).backgroundColor;

		// Si es transparente, intentamos buscar en pseudo-elementos (usado en botones Material 3)
		if (this._isColorTransparent(bg)) {
			const beforeBg = window.getComputedStyle(visualEl, '::before').backgroundColor;
			if (!this._isColorTransparent(beforeBg)) {
				bg = beforeBg;
			} else {
				const afterBg = window.getComputedStyle(visualEl, '::after').backgroundColor;
				if (!this._isColorTransparent(afterBg)) {
					bg = afterBg;
				} else {
					// Buscamos el primer elemento con fondo sólido en el árbol del objetivo
					const solidBg = this._findSolidBackground(visualEl);
					if (solidBg) bg = solidBg;
				}
			}
		}

		// Si sigue siendo transparente, evitamos que el modal se vuelva transparente
		// leyendo su propio color computado actual para que mantenga su opacidad.
		if (this._isColorTransparent(bg) && this._panel) {
			bg = window.getComputedStyle(this._panel).backgroundColor;
		}

		const computed = window.getComputedStyle(visualEl);

		return {
			rect,
			backgroundColor: bg,
			color: computed.color || 'var(--on-surface)',
			borderRadius: computed.borderRadius || '1.25rem'
		};
	}

	private _isColorTransparent(color: string | null | undefined): boolean {
		if (!color) return true;
		const c = color.replace(/\s/g, '').toLowerCase();
		return (
			c === 'rgba(0,0,0,0)' ||
			c === 'transparent' ||
			c === '' ||
			c.includes(',0)') ||
			c.includes('/0)')
		);
	}

	private _applyRect(el: HTMLElement, rect: DOMRect): void {
		el.style.top = `${rect.top}px`;
		el.style.left = `${rect.left}px`;
		el.style.width = `${rect.width}px`;
		el.style.height = `${rect.height}px`;
	}

	private _computeFinalRect(targetRect: DOMRect): DOMRect {
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const padding = 16;

		let width = this._parseSize(this.expandedWidth, vw);
		let height = this._parseSize(this.expandedHeight, vh);

		width = Math.min(width, vw - padding * 2);
		height = Math.min(height, vh - padding * 2);

		let top = targetRect.top;
		let left = targetRect.left;

		switch (this.placement) {
			case 'viewport-center':
				left = vw / 2 - width / 2;
				top = vh / 2 - height / 2;
				break;
			case 'viewport-top':
				left = vw / 2 - width / 2;
				top = padding;
				break;
			case 'viewport-bottom':
				left = vw / 2 - width / 2;
				top = vh - height - padding;
				break;
			case 'viewport-left':
				left = padding;
				top = vh / 2 - height / 2;
				break;
			case 'viewport-right':
				left = vw - width - padding;
				top = vh / 2 - height / 2;
				break;
			case 'viewport-top-left':
				left = padding;
				top = padding;
				break;
			case 'viewport-top-right':
				left = vw - width - padding;
				top = padding;
				break;
			case 'viewport-bottom-left':
				left = padding;
				top = vh - height - padding;
				break;
			case 'viewport-bottom-right':
				left = vw - width - padding;
				top = vh - height - padding;
				break;
			case 'center':
				left = targetRect.left + targetRect.width / 2 - width / 2;
				top = targetRect.top + targetRect.height / 2 - height / 2;
				break;
			case 'top':
				left = targetRect.left + targetRect.width / 2 - width / 2;
				top = this.coverTarget
					? targetRect.top + targetRect.height - height
					: targetRect.top - height;
				break;
			case 'top-start':
				left = targetRect.left + targetRect.width - width;
				top = this.coverTarget
					? targetRect.top + targetRect.height - height
					: targetRect.top - height;
				break;
			case 'top-end':
				left = targetRect.left;
				top = this.coverTarget
					? targetRect.top + targetRect.height - height
					: targetRect.top - height;
				break;
			case 'bottom':
				left = targetRect.left + targetRect.width / 2 - width / 2;
				top = this.coverTarget
					? targetRect.top
					: targetRect.top + targetRect.height;
				break;
			case 'bottom-start':
				left = targetRect.left + targetRect.width - width;
				top = this.coverTarget
					? targetRect.top
					: targetRect.top + targetRect.height;
				break;
			case 'bottom-end':
				left = targetRect.left;
				top = this.coverTarget
					? targetRect.top
					: targetRect.top + targetRect.height;
				break;
			case 'left':
				left = this.coverTarget
					? targetRect.left + targetRect.width - width
					: targetRect.left - width;
				top = targetRect.top + targetRect.height / 2 - height / 2;
				break;
			case 'left-start':
				left = this.coverTarget
					? targetRect.left + targetRect.width - width
					: targetRect.left - width;
				top = targetRect.top + targetRect.height - height;
				break;
			case 'left-end':
				left = this.coverTarget
					? targetRect.left + targetRect.width - width
					: targetRect.left - width;
				top = targetRect.top;
				break;
			case 'right':
				left = this.coverTarget
					? targetRect.left
					: targetRect.left + targetRect.width;
				top = targetRect.top + targetRect.height / 2 - height / 2;
				break;
			case 'right-start':
				left = this.coverTarget
					? targetRect.left
					: targetRect.left + targetRect.width;
				top = targetRect.top + targetRect.height - height;
				break;
			case 'right-end':
				left = this.coverTarget
					? targetRect.left
					: targetRect.left + targetRect.width;
				top = targetRect.top;
				break;
		}

		left = Math.max(padding, Math.min(left, vw - width - padding));
		top = Math.max(padding, Math.min(top, vh - height - padding));

		return new DOMRect(left, top, width, height);
	}

	private _parseSize(value: string, ref: number): number {
		const num = parseFloat(value);
		if (Number.isNaN(num)) return 352;
		if (value.endsWith('px')) return num;
		if (value.endsWith('rem')) return num * 16;
		if (value.endsWith('em')) return num * 16;
		if (value.endsWith('%')) return (num / 100) * ref;
		if (value.endsWith('vw')) return (num / 100) * window.innerWidth;
		if (value.endsWith('vh')) return (num / 100) * window.innerHeight;
		return num;
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: contents;
			}

			.backdrop {
				position: fixed;
				inset: 0;
				background-color: var(--scrim);
				opacity: 0;
				visibility: hidden;
				transition:
					opacity var(--_backdrop-duration, 0.35s) var(--_backdrop-ease, cubic-bezier(0.2, 0, 0, 1)),
					visibility var(--_backdrop-duration, 0.35s) var(--_backdrop-ease, cubic-bezier(0.2, 0, 0, 1));
				z-index: calc(var(--_z-index, 100) - 1);
			}

			.backdrop.open {
				opacity: 1;
				visibility: visible;
			}

			.panel {
				position: fixed;
				visibility: hidden;
				opacity: 0;
				pointer-events: none;
				display: flex;
				flex-direction: column;
				overflow: hidden;
				background-color: var(--surface-container-high);
				color: var(--on-surface);
				border-radius: 1.75rem;
				box-shadow: var(--elevate2);
				z-index: var(--_z-index, 100);
			}

			.panel-inner {
				display: flex;
				flex-direction: column;
				width: var(--_panel-width, 100%);
				height: var(--_panel-height, 100%);
				flex-shrink: 0;
				overflow: hidden;
			}

			header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 0.75rem;
				padding: 1.25rem 1.5rem 0.75rem;
				min-block-size: 3.5rem;
			}

			header.is-empty {
				display: none;
			}

			.body {
				flex: 1;
				overflow-y: auto;
				padding: 0 1.5rem;
				scrollbar-gutter: stable;
			}

			.panel.is-animating .body {
				overflow: hidden;
			}

			footer {
				display: flex;
				align-items: center;
				justify-content: flex-end;
				gap: 0.5rem;
				padding: 1rem 1.5rem 1.5rem;
				border-top: 0.0625rem solid var(--outline-variant);
			}

			footer.is-empty {
				display: none;
			}

			.close-btn {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				inline-size: 2.5rem;
				block-size: 2.5rem;
				padding: 0;
				border: none;
				border-radius: 50%;
				background: transparent;
				color: var(--on-surface-variant);
				cursor: pointer;
				font-size: 1.25rem;
			}

			.close-btn:hover {
				background-color: var(--active);
			}

			.morph-text,
			.morph-icon {
				position: fixed;
				pointer-events: none;
				box-sizing: border-box;
				overflow: hidden;
				will-change: transform, width, height, color, font-size;
			}

			.trigger-label-slot {
				display: none;
			}
		`
	];

	override render() {
		const visible = this._visible || this.open;
		const headerEmpty = !this._hasHeader && !this.showCloseButton;
		return html`
			${this.hasBackdrop ? html`
				<div
					class="backdrop ${visible ? 'open' : ''}"
					part="backdrop"
					style="${!this.modal ? 'background-color: transparent;' : ''}"
				></div>
			` : ''}
			<div class="panel" part="panel">
				<div class="panel-inner" part="panel-inner">
					<header
						class="${headerEmpty ? 'is-empty' : ''}"
						part="header"
					>
						<div class="header-morph-wrapper"><slot name="header" @slotchange=${this._onHeaderSlotChange}></slot></div>
						${this.showCloseButton
							? html`
									<button
										class="close-btn"
										@click=${this.hide}
										aria-label="Cerrar"
									>
										<moni-icon name="close"></moni-icon>
									</button>
							  `
							: ''}
					</header>
					<div class="body" part="body"><slot></slot></div>
					<footer
						class="${this._hasFooter ? '' : 'is-empty'}"
						part="footer"
					>
						<slot name="footer" @slotchange=${this._onFooterSlotChange}></slot>
					</footer>
				</div>
			</div>
			<div class="trigger-label-slot">
				<slot name="trigger-label" @slotchange=${this._onTriggerLabelSlotChange}></slot>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-morph-modal': MoniMorphModal;
	}
}

export default MoniMorphModal;
