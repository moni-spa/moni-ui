import { html, css, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';
import { MoniElement, sharedStyles, fieldStyles } from './_base/index.js';
import './moni-icon.js';
import './moni-progress.js';
import './moni-select-option.js';

interface OptionNode {
	type: 'option';
	value: string;
	label: string;
	disabled?: boolean;
	element?: HTMLElement;
	group?: string;
}

interface GroupNode {
	type: 'group';
	label: string;
	children: DropdownNode[];
}

type DropdownNode = OptionNode | GroupNode;

/**
 * Custom Searchable Select Component with Subcategories, Animations, and Drawer/Sheet option.
 */
@customElement('moni-select')
export class MoniSelect extends MoniElement {
	@property({ reflect: true }) name = '';
	@property({ reflect: true }) label = '';
	@property({ reflect: true }) variant: 'filled' | 'outlined' = 'filled';
	@property({ reflect: true })
	size: 'small' | 'medium' | 'large' | 'extra' = 'medium';
	@property({ reflect: true })
	shape: 'round' | 'square' | 'no-round' = 'no-round';
	@property({ type: Boolean, reflect: true }) disabled = false;
	@property({ type: Boolean, reflect: true }) loading = false;
	@property({ reflect: true }) helper = '';
	@property({ reflect: true, attribute: 'error-text' }) errorText = '';
	@property({ type: Boolean, reflect: true }) error = false;
	@property({ reflect: true }) value = '';
	@property({ reflect: true }) icon = '';
	@property({ reflect: true, attribute: 'trailing-icon' }) trailingIcon =
		'arrow_drop_down';
	@property({ type: Boolean, reflect: true }) searchable = false;
	@property({ type: Boolean, reflect: true }) clearable = false;
	@property({ type: Boolean, reflect: true }) sheet = false;
	@property({ reflect: true }) placeholder = '';
	@property({ reflect: true }) positioning: 'absolute' | 'fixed' = 'absolute';
	@property({ reflect: true }) placement: 'top' | 'bottom' | 'left' | 'right' | 'auto' = 'auto';
	@property({ reflect: true, attribute: 'dropdown-width' }) dropdownWidth = 'trigger';

	@state() private _open = false;
	@state() private _searchQuery = '';
	@state() private _actualPlacement: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
	@state() private _parsedOptions: DropdownNode[] = [];
	@state() private _activeIndex = -1;
	@state() private _menuStyle = '';
	@state() private _useInlineCategories = false;
	@state() private _drilldownPath: GroupNode[] = [];

	@query('slot') private _slot!: HTMLSlotElement;
	@query('input') private _input!: HTMLInputElement;

	static override styles = [
		sharedStyles,
		fieldStyles,
		css`
			:host {
				position: relative;
				display: block;
			}

			.field {
				cursor: pointer;
			}

			input[type='text'] {
				cursor: pointer;
				width: 100%;
			}

			input[type='text'][readonly] {
				caret-color: transparent;
				user-select: none;
			}

			/* Dropdown menu overlay */
			.dropdown-menu {
				position: absolute;
				top: 100%;
				left: 0;
				right: 0;
				z-index: 100;
				background-color: var(--surface-container);
				box-shadow: var(--elevate3);
				border-radius: 0.5rem;
				margin-top: 4px;
				padding: 4px 0;
				list-style: none;
				opacity: 0;
				visibility: hidden;
				transform: scale(0.95) translateY(-8px);
				transform-origin: top;
				transition: 
					opacity var(--speed3) cubic-bezier(0.2, 0.8, 0.2, 1), 
					transform var(--speed3) cubic-bezier(0.34, 1.56, 0.64, 1), 
					visibility var(--speed3);
			}

			.dropdown-menu.open {
				opacity: 1;
				visibility: visible;
				transform: scale(1) translateY(0);
			}

			.dropdown-menu.placement-top {
				top: auto;
				bottom: 100%;
				margin-top: 0;
				margin-bottom: 4px;
				transform-origin: bottom;
				transform: scale(0.95) translateY(8px);
			}

			.dropdown-menu.placement-top.open {
				transform: scale(1) translateY(0);
			}

			.dropdown-menu.placement-left {
				top: 0;
				left: auto;
				right: 100%;
				margin-top: 0;
				margin-right: 4px;
				transform-origin: right center;
				transform: scale(0.95) translateX(8px);
			}

			.dropdown-menu.placement-left.open {
				transform: scale(1) translateX(0);
			}

			.dropdown-menu.placement-right {
				top: 0;
				left: 100%;
				right: auto;
				margin-top: 0;
				margin-left: 4px;
				transform-origin: left center;
				transform: scale(0.95) translateX(-8px);
			}

			.dropdown-menu.placement-right.open {
				transform: scale(1) translateX(0);
			}

			.dropdown-menu.open.searching,
			.dropdown-menu.open.inline-categories {
				max-height: 250px;
				overflow-y: auto;
			}

			.dropdown-menu.open:not(.searching):not(.inline-categories) {
				overflow: visible;
			}

			/* Bottom sheet drawer styles */
			.sheet-backdrop {
				position: fixed;
				inset: 0;
				z-index: 1000;
				background-color: rgba(0, 0, 0, 0.4);
				opacity: 0;
				visibility: hidden;
				transition: opacity var(--speed3) cubic-bezier(0.2, 0.8, 0.2, 1), visibility var(--speed3);
				display: flex;
				flex-direction: column;
				justify-content: flex-end;
			}

			.sheet-backdrop.open {
				opacity: 1;
				visibility: visible;
			}

			.sheet-drawer {
				background-color: var(--surface-container);
				border-radius: 1.75rem 1.75rem 0 0;
				box-shadow: var(--elevate3);
				max-height: 70vh;
				display: flex;
				flex-direction: column;
				transform: translateY(100%);
				transition: transform var(--speed3) cubic-bezier(0.16, 1, 0.3, 1);
				padding: 16px 0;
			}

			.sheet-drawer.open {
				transform: translateY(0);
			}

			.sheet-handle {
				width: 40px;
				height: 4px;
				background-color: var(--outline-variant);
				border-radius: 2px;
				margin: 0 auto 16px;
			}

			.sheet-title {
				padding: 0 24px 8px;
				font-size: 1.125rem;
				font-weight: 700;
				color: var(--on-surface);
			}

			.sheet-search-wrapper {
				padding: 0 16px 12px;
			}

			.sheet-search-input {
				width: 100%;
				box-sizing: border-box;
				padding: 10px 16px;
				border: 1px solid var(--outline);
				border-radius: 9999px;
				background: var(--surface-container-high);
				color: var(--on-surface);
				font-size: 1rem;
				outline: none;
			}

			.sheet-search-input:focus {
				border-color: var(--primary);
			}

			.sheet-options-list {
				list-style: none;
				padding: 0;
				margin: 0;
				overflow-y: auto;
				flex: 1;
			}

			/* Animated Drilldown Slide Layout */
			.drilldown-wrapper {
				width: 100%;
				overflow: hidden;
				position: relative;
				transition: height var(--speed3) cubic-bezier(0.2, 0.8, 0.2, 1);
			}

			.drilldown-track {
				display: flex;
				width: 200%;
				transition: transform var(--speed3) cubic-bezier(0.2, 0.8, 0.2, 1);
			}

			.drilldown-track.slide-active {
				transform: translateX(-50%);
			}

			.drilldown-panel {
				width: 50%;
				box-sizing: border-box;
				list-style: none;
				padding: 0;
				margin: 0;
				flex-shrink: 0;
			}

			.drilldown-panel.panel-active {
				max-height: none;
			}

			.drilldown-panel.panel-inactive {
				max-height: 0;
				overflow: hidden;
			}

			/* Group / Subcategory header (Browsing mode - acts as a hover trigger for submenus) */
			.group-header {
				padding: 8px 16px;
				font-size: 0.875rem;
				font-weight: 500;
				color: var(--on-surface);
				cursor: pointer;
				display: flex;
				align-items: center;
				position: relative;
				user-select: none;
				transition: background-color var(--speed2) ease, color var(--speed2) ease;
			}

			.group-header:hover,
			.group-header.active {
				background-color: var(--surface-container-high);
				color: var(--primary);
			}

			/* Inline header (Searching mode & Sheet mode - flat layout) */
			.group-header-flat {
				padding: 6px 16px;
				font-size: 0.75rem;
				font-weight: 700;
				text-transform: uppercase;
				color: var(--primary);
				letter-spacing: 0.05em;
				background-color: var(--surface-container-low);
				user-select: none;
			}

			/* Hierarchical sub-menu with premium flyout animation */
			.submenu {
				display: block;
				opacity: 0;
				visibility: hidden;
				position: absolute;
				top: 0;
				background-color: var(--surface-container-highest);
				box-shadow: var(--elevate3);
				border-radius: 0.5rem;
				padding: 4px 0;
				list-style: none;
				min-width: 160px;
				z-index: 110;
				transition: 
					opacity var(--speed2) cubic-bezier(0.2, 0.8, 0.2, 1), 
					transform var(--speed2) cubic-bezier(0.34, 1.56, 0.64, 1), 
					visibility var(--speed2);
			}

			.submenu.open-right {
				left: 100%;
				margin-left: 2px;
				transform: scale(0.9) translateX(-10px);
				transform-origin: top left;
			}

			.submenu.open-left {
				right: 100%;
				margin-right: 2px;
				transform: scale(0.9) translateX(10px);
				transform-origin: top right;
			}

			.group-header:hover > .submenu.active,
			.group-header.active > .submenu.active {
				opacity: 1;
				visibility: visible;
				transform: scale(1) translateX(0);
			}

			.option-item {
				cursor: pointer;
				padding: 8px 16px;
				font-size: 0.875rem;
				color: var(--on-surface);
				display: flex;
				align-items: center;
				transition: background-color var(--speed2) ease;
			}

			.option-item:hover,
			.option-item.active-nav {
				background-color: var(--surface-container-high);
			}

			.option-item.selected {
				background-color: var(--tertiary-container);
				color: var(--on-tertiary-container);
				font-weight: 500;
			}

			.option-item.disabled {
				opacity: 0.5;
				pointer-events: none;
			}

			.no-options {
				padding: 12px 16px;
				font-size: 0.875rem;
				color: var(--outline);
				text-align: center;
			}
		`
	];

	override connectedCallback() {
		super.connectedCallback();
		document.addEventListener('click', this._handleOutsideClick);
		window.addEventListener('scroll', this._handleScroll, { capture: true });
		window.addEventListener('resize', this._handleResize);
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		document.removeEventListener('click', this._handleOutsideClick);
		window.removeEventListener('scroll', this._handleScroll, { capture: true });
		window.removeEventListener('resize', this._handleResize);
	}

	override updated(changedProperties: Map<string | number | symbol, unknown>) {
		super.updated(changedProperties);
		if (
			changedProperties.has('_open') ||
			changedProperties.has('_drilldownPath') ||
			changedProperties.has('_searchQuery') ||
			changedProperties.has('_useInlineCategories') ||
			changedProperties.has('_parsedOptions')
		) {
			this._updateWrapperHeight();
		}
	}

	private _updateWrapperHeight() {
		const wrapper = this.shadowRoot?.querySelector('.drilldown-wrapper') as HTMLElement;
		if (!wrapper) return;

		if (!this._open || this.sheet) {
			wrapper.style.height = '';
			return;
		}

		// Wait for Lit render and styles to apply
		requestAnimationFrame(() => {
			const activePanel = this.shadowRoot?.querySelector('.drilldown-panel.panel-active') as HTMLElement;
			if (activePanel) {
				wrapper.style.height = `${activePanel.scrollHeight}px`;
			} else {
				wrapper.style.height = '';
			}
		});
	}

	private _handleOutsideClick = (e: MouseEvent) => {
		if (this._open && !e.composedPath().includes(this)) {
			this._closeDropdown();
		}
	};

	private _determineActualPlacement() {
		if (this.sheet) {
			this._actualPlacement = 'bottom';
			return;
		}

		const rect = this.getBoundingClientRect();
		const viewportHeight = window.innerHeight;
		const viewportWidth = window.innerWidth;
		const spaceBelow = viewportHeight - rect.bottom;
		const spaceAbove = rect.top;
		const spaceRight = viewportWidth - rect.right;
		const spaceLeft = rect.left;
		const menuHeight = 260; // 250px max-height + 10px buffer
		const menuWidth = 180; // Estimated menu width buffer

		let preferred = this.placement;
		if (preferred === 'auto') {
			preferred = spaceBelow >= menuHeight ? 'bottom' : (spaceAbove > spaceBelow ? 'top' : 'bottom');
		}

		if (preferred === 'top') {
			if (spaceAbove < menuHeight && spaceBelow > spaceAbove) {
				this._actualPlacement = 'bottom';
			} else {
				this._actualPlacement = 'top';
			}
		} else if (preferred === 'bottom') {
			if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
				this._actualPlacement = 'top';
			} else {
				this._actualPlacement = 'bottom';
			}
		} else if (preferred === 'left') {
			if (spaceLeft < menuWidth && spaceRight > spaceLeft) {
				this._actualPlacement = 'right';
			} else {
				this._actualPlacement = 'left';
			}
		} else if (preferred === 'right') {
			if (spaceRight < menuWidth && spaceLeft > spaceRight) {
				this._actualPlacement = 'left';
			} else {
				this._actualPlacement = 'right';
			}
		}
	}

	private _handleScroll = () => {
		if (this._open) {
			this._determineActualPlacement();
			this._updateMenuPosition();
		}
	};

	private _handleResize = () => {
		if (this._open) {
			this._determineActualPlacement();
			this._updateMenuPosition();
		}
	};

	private _updateMenuPosition() {
		if (!this._open || this.sheet) return;
		
		this._determineActualPlacement();

		if (this.positioning !== 'fixed') return;

		const rect = this.getBoundingClientRect();
		let widthStyle = '';
		if (this.dropdownWidth === 'trigger') {
			widthStyle = `width: ${rect.width}px;`;
		} else if (this.dropdownWidth === 'auto') {
			widthStyle = 'width: auto; min-width: 160px; max-width: 320px;';
		} else {
			widthStyle = `width: ${this.dropdownWidth};`;
		}

		if (this._actualPlacement === 'top') {
			this._menuStyle = `
				position: fixed;
				bottom: ${window.innerHeight - rect.top}px;
				left: ${rect.left}px;
				${widthStyle}
				top: auto;
				right: auto;
			`;
		} else if (this._actualPlacement === 'bottom') {
			this._menuStyle = `
				position: fixed;
				top: ${rect.bottom}px;
				left: ${rect.left}px;
				${widthStyle}
				bottom: auto;
				right: auto;
			`;
		} else if (this._actualPlacement === 'left') {
			this._menuStyle = `
				position: fixed;
				top: ${rect.top}px;
				right: ${window.innerWidth - rect.left + 4}px;
				${widthStyle}
				left: auto;
				bottom: auto;
			`;
		} else if (this._actualPlacement === 'right') {
			this._menuStyle = `
				position: fixed;
				top: ${rect.top}px;
				left: ${rect.right + 4}px;
				${widthStyle}
				right: auto;
				bottom: auto;
			`;
		}
	}

	private _getMenuStyle() {
		if (this.positioning === 'fixed') {
			return this._menuStyle;
		}

		if (this.dropdownWidth === 'auto') {
			return 'width: max-content; min-width: 160px; max-width: 320px;';
		} else if (this.dropdownWidth !== 'trigger') {
			return `width: ${this.dropdownWidth};`;
		}
		return '';
	}

	private _onSlotChange() {
		if (!this._slot) return;
		const assigned = this._slot.assignedElements({ flatten: true });
		
		const tree: DropdownNode[] = [];

		const findOrCreateGroup = (nodes: DropdownNode[], label: string): GroupNode => {
			let group = nodes.find(n => n.type === 'group' && n.label === label) as GroupNode;
			if (!group) {
				group = { type: 'group', label, children: [] };
				nodes.push(group);
			}
			return group;
		};

		const insertOption = (targetTree: DropdownNode[], opt: OptionNode, groupPath: string[]) => {
			let currentLevel = targetTree;
			if (groupPath.length > 0) {
				opt.group = groupPath.join(' / ');
			}
			groupPath.forEach(part => {
				const group = findOrCreateGroup(currentLevel, part);
				currentLevel = group.children;
			});
			currentLevel.push(opt);
		};

		const parseElement = (el: Element, parentGroupPath: string[]) => {
			const tag = el.tagName.toLowerCase();
			if (tag === 'option' || tag === 'moni-select-option') {
				const opt: OptionNode = {
					type: 'option',
					value: el.getAttribute('value') || '',
					label: el.textContent?.trim() || el.getAttribute('label') || el.getAttribute('value') || '',
					disabled: el.hasAttribute('disabled'),
					element: el as HTMLElement
				};
				const groupAttr = el.getAttribute('group');
				const localPath = groupAttr ? groupAttr.split('/').map(s => s.trim()).filter(Boolean) : [];
				const finalPath = [...parentGroupPath, ...localPath];
				insertOption(tree, opt, finalPath);
			} else if (tag === 'optgroup') {
				const label = el.getAttribute('label') || '';
				const localPath = [...parentGroupPath, label];
				Array.from(el.children).forEach(child => parseElement(child, localPath));
			}
		};

		assigned.forEach(el => parseElement(el, []));
		this._parsedOptions = tree;
		this.requestUpdate();
	}

	private _toggleDropdown(e?: Event) {
		if (e) {
			e.stopPropagation();
		}
		if (this.disabled) return;
		if (this._open) {
			this._closeDropdown();
		} else {
			this._openDropdown();
		}
	}

	private _onInputClick(e: MouseEvent) {
		if (this.disabled) return;
		if (this.searchable && !this.sheet) {
			if (!this._open) {
				this._openDropdown();
			}
		} else {
			this._toggleDropdown(e);
		}
	}

	private _openDropdown() {
		this._open = true;
		this._activeIndex = -1;
		this._drilldownPath = [];

		this._determineActualPlacement();

		// Measure viewport to determine if we should fall back to inline categories
		const rect = this.getBoundingClientRect();
		const spaceOnRight = window.innerWidth - rect.right;
		const spaceOnLeft = rect.left;
		this._useInlineCategories = window.innerWidth < 600 || (spaceOnRight < 160 && spaceOnLeft < 160);

		if (this.positioning === 'fixed') {
			this._updateMenuPosition();
		}
		if (this.searchable) {
			const selectedOpt = this._findOptionByValue(this.value);
			this._searchQuery = selectedOpt ? selectedOpt.label : '';
			setTimeout(() => {
				if (this._input && !this.sheet) {
					this._input.focus();
					this._input.select();
				} else if (this.sheet) {
					const sheetInput = this.shadowRoot?.querySelector('.sheet-search-input') as HTMLInputElement;
					if (sheetInput) {
						sheetInput.focus();
						sheetInput.select();
					}
				}
			}, 50);
		}
	}

	private _closeDropdown() {
		this._open = false;
		this._searchQuery = '';
		this.requestUpdate();
	}

	private _findOptionByValue(value: string): OptionNode | undefined {
		return this._getFlatOptions(this._parsedOptions).find(opt => opt.value === value);
	}

	private _onSearchInput(e: Event) {
		const query = (e.target as HTMLInputElement).value;
		this._searchQuery = query;
		this._open = true;
		this._activeIndex = -1;

		if (this.clearable && query.trim() === '') {
			this.value = '';
			this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
			this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
			return;
		}

		const flat = this._getFlatOptions(this._parsedOptions);
		const exactMatch = flat.find(
			opt => opt.label.toLowerCase() === query.trim().toLowerCase()
		);
		if (exactMatch && !exactMatch.disabled) {
			this._selectOption(exactMatch);
		}
	}

	private _selectOption(option: OptionNode) {
		if (option.disabled) return;
		this.value = option.value;
		this._closeDropdown();

		this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
		this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
	}

	private _onSubmenuMouseEnter(e: MouseEvent) {
		const headerEl = e.currentTarget as HTMLElement;
		const submenu = headerEl.querySelector(':scope > .submenu') as HTMLElement;
		if (!submenu) return;

		const rect = headerEl.getBoundingClientRect();
		const spaceOnRight = window.innerWidth - rect.right;
		const spaceOnLeft = rect.left;
		const submenuWidth = 160;

		if (spaceOnRight < submenuWidth && spaceOnLeft > spaceOnRight) {
			submenu.classList.remove('open-right');
			submenu.classList.add('open-left');
		} else {
			submenu.classList.remove('open-left');
			submenu.classList.add('open-right');
		}
	}

	private _onKeyDown(e: KeyboardEvent) {
		if (this.disabled) return;

		const visible = this._getVisibleOptions();

		if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (!this._open) {
				this._openDropdown();
			} else if (visible.length > 0) {
				this._activeIndex = (this._activeIndex + 1) % visible.length;
				this._scrollToActive();
			}
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (this._open && visible.length > 0) {
				this._activeIndex = (this._activeIndex - 1 + visible.length) % visible.length;
				this._scrollToActive();
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
			if (this._open) {
				if (this._activeIndex >= 0 && this._activeIndex < visible.length) {
					this._selectOption(visible[this._activeIndex]);
				}
			} else {
				this._openDropdown();
			}
		} else if (e.key === 'Escape') {
			e.preventDefault();
			this._closeDropdown();
		}
	}

	private _scrollToActive() {
		setTimeout(() => {
			const activeEl = this.shadowRoot?.querySelector('.option-item.active-nav');
			if (activeEl) {
				activeEl.scrollIntoView({ block: 'nearest' });
			}
		}, 0);
	}

	private _getFlatOptions(nodes: DropdownNode[]): OptionNode[] {
		const flat: OptionNode[] = [];
		const traverse = (n: DropdownNode) => {
			if (n.type === 'option') {
				flat.push(n);
			} else {
				n.children.forEach(traverse);
			}
		};
		nodes.forEach(traverse);
		return flat;
	}

	private _getFilteredOptions(): OptionNode[] {
		const flat = this._getFlatOptions(this._parsedOptions);
		if (!this._searchQuery) return flat;
		const query = this._searchQuery.toLowerCase();
		return flat.filter(opt =>
			opt.label.toLowerCase().includes(query) || opt.value.toLowerCase().includes(query)
		);
	}

	private _getVisibleOptions(): OptionNode[] {
		const filtered = this._getFilteredOptions();
		if (this._searchQuery) return filtered;

		if (this.sheet || this._useInlineCategories) {
			if (this._drilldownPath.length > 0) {
				const activeGroup = this._drilldownPath[this._drilldownPath.length - 1];
				return activeGroup.children.filter(n => n.type === 'option') as OptionNode[];
			}
			return this._parsedOptions.filter(n => n.type === 'option') as OptionNode[];
		}

		return filtered;
	}

	private _renderRootList() {
		let visibleIndex = 0;
		return this._parsedOptions.map(node => {
			if (node.type === 'option') {
				const currentIdx = visibleIndex++;
				const isSelected = node.value === this.value;
				const isActiveNav = this._drilldownPath.length === 0 && currentIdx === this._activeIndex;
				return html`
					<li
						class="option-item ${isSelected ? 'selected' : ''} ${isActiveNav ? 'active-nav' : ''} ${node.disabled ? 'disabled' : ''}"
						@click=${() => this._selectOption(node)}
					>
						${node.label}
					</li>
				`;
			}

			return html`
				<li class="group-header" @click=${(e: Event) => { e.stopPropagation(); this._drilldownPath = [...this._drilldownPath, node]; }}>
					<span>${node.label}</span>
					<moni-icon name="chevron_right" style="margin-inline-start: auto; font-size: 1.125rem;"></moni-icon>
				</li>
			`;
		});
	}

	private _renderSubcategoryList() {
		if (this._drilldownPath.length === 0) return nothing;
		const activeGroup = this._drilldownPath[this._drilldownPath.length - 1];
		let visibleIndex = 0;

		return html`
			<li class="group-header" @click=${(e: Event) => { e.stopPropagation(); this._drilldownPath = this._drilldownPath.slice(0, -1); }}>
				<moni-icon name="arrow_back" style="font-size: 1.25rem; margin-inline-end: 8px;"></moni-icon>
				<span>Regresar</span>
			</li>
			<li class="group-header-flat">${activeGroup.label}</li>
			${activeGroup.children.map(node => {
				if (node.type === 'option') {
					const currentIdx = visibleIndex++;
					const isSelected = node.value === this.value;
					const isActiveNav = this._drilldownPath.length > 0 && currentIdx === this._activeIndex;
					return html`
						<li
							class="option-item ${isSelected ? 'selected' : ''} ${isActiveNav ? 'active-nav' : ''} ${node.disabled ? 'disabled' : ''}"
							@click=${() => this._selectOption(node)}
						>
							${node.label}
						</li>
					`;
				}

				return html`
					<li class="group-header" @click=${(e: Event) => { e.stopPropagation(); this._drilldownPath = [...this._drilldownPath, node]; }}>
						<span>${node.label}</span>
						<moni-icon name="chevron_right" style="margin-inline-start: auto; font-size: 1.125rem;"></moni-icon>
					</li>
				`;
			})}
		`;
	}

	private _renderDesktopNode(node: DropdownNode, flatIndexRef: { value: number }): any {
		if (node.type === 'option') {
			const currentIdx = flatIndexRef.value++;
			const isSelected = node.value === this.value;
			const isActiveNav = currentIdx === this._activeIndex;
			return html`
				<li
					class="option-item ${isSelected ? 'selected' : ''} ${isActiveNav ? 'active-nav' : ''} ${node.disabled ? 'disabled' : ''}"
					@click=${() => this._selectOption(node)}
				>
					${node.label}
				</li>
			`;
		}

		return html`
			<li 
				class="group-header"
				@mouseenter=${this._onSubmenuMouseEnter}
				@click=${(e: Event) => e.stopPropagation()}
			>
				<span>${node.label}</span>
				<moni-icon name="chevron_right" style="margin-inline-start: auto; font-size: 1.125rem;"></moni-icon>
				
				<ul class="submenu active open-right">
					${node.children.map(child => this._renderDesktopNode(child, flatIndexRef))}
				</ul>
			</li>
		`;
	}

	private _renderOptionsList(filtered: OptionNode[]) {
		if (this._parsedOptions.length === 0) {
			return html`<li class="no-options">No options found</li>`;
		}

		if (this._searchQuery) {
			const groups: { [key: string]: OptionNode[] } = {};
			filtered.forEach(opt => {
				const gName = opt.group || '';
				if (!groups[gName]) groups[gName] = [];
				groups[gName].push(opt);
			});

			let flatIndex = 0;
			return Object.entries(groups).map(([groupName, groupOpts]) => html`
				${groupName ? html`<li class="group-header-flat">${groupName}</li>` : nothing}
				${groupOpts.map(opt => {
					const currentIdx = flatIndex++;
					const isSelected = opt.value === this.value;
					const isActiveNav = currentIdx === this._activeIndex;
					return html`
						<li
							class="option-item ${isSelected ? 'selected' : ''} ${isActiveNav ? 'active-nav' : ''} ${opt.disabled ? 'disabled' : ''}"
							@click=${() => this._selectOption(opt)}
						>
							${opt.label}
						</li>
					`;
				})}
			`);
		}

		if (this.sheet || this._useInlineCategories) {
			const isRootActive = this._drilldownPath.length === 0;
			const isSubActive = !isRootActive;

			return html`
				<div class="drilldown-wrapper">
					<div class="drilldown-track ${this._drilldownPath.length > 0 ? 'slide-active' : ''}">
						<ul class="drilldown-panel ${isRootActive ? 'panel-active' : 'panel-inactive'}">
							${this._renderRootList()}
						</ul>
						<ul class="drilldown-panel ${isSubActive ? 'panel-active' : 'panel-inactive'}">
							${this._renderSubcategoryList()}
						</ul>
					</div>
				</div>
			`;
		}

		const flatIndexRef = { value: 0 };
		return this._parsedOptions.map(node => this._renderDesktopNode(node, flatIndexRef));
	}

	override render() {
		const hasLeading = Boolean(this.icon);
		const filtered = this._getFilteredOptions();
		
		// Find selected option label
		const selectedOpt = this._findOptionByValue(this.value);
		const displayValue = this._open && this.searchable && !this.sheet
			? this._searchQuery 
			: (selectedOpt ? selectedOpt.label : '');

		const isActive = Boolean(displayValue || this.placeholder);

		const fieldClasses = {
			field: true,
			label: Boolean(this.label),
			fill: this.variant === 'filled',
			border: this.variant === 'outlined',
			small: this.size === 'small',
			large: this.size === 'large',
			extra: this.size === 'extra',
			prefix: hasLeading,
			suffix: true,
			invalid: this.error,
			round: this.shape === 'round',
			square: this.shape === 'no-round'
		};

		const leading = this.icon
			? html`<i class="leading-icon" part="leading-icon"
					><moni-icon name="${this.icon}"></moni-icon
				></i>`
			: nothing;

		const trailing = this.loading
			? html`<i class="trailing-icon" part="trailing-icon"
					><moni-progress
						variant="circular"
						indeterminate
						size="small"
						style="inline-size: 1.25rem; block-size: 1.25rem; color: currentColor;"
					></moni-progress
				></i>`
			: html`<i class="trailing-icon" part="trailing-icon" @click=${this._toggleDropdown}
					><moni-icon name="${this.trailingIcon}"></moni-icon
				></i>`;

		const menuClasses = {
			'dropdown-menu': true,
			open: this._open,
			searching: Boolean(this._searchQuery),
			'inline-categories': this._useInlineCategories,
			'placement-top': this._actualPlacement === 'top',
			'placement-bottom': this._actualPlacement === 'bottom'
		};

		return html`<div class=${classMap(fieldClasses)} part="field">
			${leading}
			<input
				type="text"
				part="input"
				.value=${displayValue}
				?readonly=${!this.searchable || this.sheet}
				?disabled=${this.disabled}
				inputmode=${ifDefined(!this.searchable || this.sheet ? 'none' : undefined)}
				placeholder=${this.placeholder || ''}
				class=${isActive ? 'active' : ''}
				@click=${this._onInputClick}
				@input=${this._onSearchInput}
				@keydown=${this._onKeyDown}
			/>
			${this.label
				? html`<label
						part="label"
						class=${classMap({ active: isActive })}
						>${this.label}</label
					>`
				: nothing}
			${trailing}
			
			${this.sheet
				? html`
					<div class="sheet-backdrop ${this._open ? 'open' : ''}" @click=${this._closeDropdown}>
						<div class="sheet-drawer ${this._open ? 'open' : ''}" @click=${(e: Event) => e.stopPropagation()}>
							<div class="sheet-handle"></div>
							${this.label ? html`<div class="sheet-title">${this.label}</div>` : nothing}
							${this.searchable 
								? html`
									<div class="sheet-search-wrapper">
										<input
											type="text"
											class="sheet-search-input"
											.value=${this._searchQuery}
											placeholder="Buscar..."
											@input=${this._onSearchInput}
										/>
									</div>
								` 
								: nothing}
							<ul class="sheet-options-list">
								${this._renderOptionsList(filtered)}
							</ul>
						</div>
					</div>
				`
				: html`
					<ul 
						class=${classMap(menuClasses)} 
						part="menu"
						style=${this._getMenuStyle()}
					>
						${this._renderOptionsList(filtered)}
					</ul>
				`}

			<slot style="display: none;" @slotchange=${this._onSlotChange}></slot>

			${this.error
				? html`<output part="helper" class="invalid"
						>${this.errorText || this.helper}</output
					>`
				: this.helper
					? html`<output part="helper">${this.helper}</output>`
					: nothing}
		</div>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-select': MoniSelect;
	}
}

export default MoniSelect;
