/**
 * @file components/moni-typography.ts
 * @package @moni-labs/moni-ui
 * @license MIT
 * @contributors Moni Labs & Contributors
 */

import { css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeStatic, html as staticHtml } from 'lit/static-html.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material Design 3 Typography component.
 *
 * A specialized text component that enforces the M3 type scale. It ensures
 * typography is consistent, accessible, and correctly styled across the
 * application without requiring manual CSS classes.
 *
 * **M3 spec reference:** `m3-docs/components/typography/specs.md`
 *
 * **Type Scale Categories:**
 * - `display`: The largest text on the screen, reserved for short, important
 *   text or numerals. Works best on large screens. (Renders `<h1>` by default).
 * - `headline`: High-emphasis text for primary page/section headers.
 *   (Renders `<h2>` by default).
 * - `title`: Medium-emphasis text used for dialog headers or smaller section
 *   titles. (Renders `<h3>` by default).
 * - `body`: Standard paragraph text used for long-form content.
 *   (Renders `<p>` by default).
 * - `label`: Small, utilitarian text used for buttons, captions, and form
 *   elements. (Renders `<label>` by default).
 *
 * Each category supports three sizes: `large`, `medium`, and `small`.
 *
 * **Semantic Tags:**
 * The component automatically selects an appropriate HTML semantic tag based on
 * the variant. You can explicitly override this by setting the `as` attribute
 * (e.g., to render a `headline` style but using a `<span>` tag for SEO or
 * structural reasons).
 *
 * @example
 * ```html
 * <!-- Renders an <h1> with display-large styles -->
 * <moni-typography variant="display" size="large">Hero Text</moni-typography>
 *
 * <!-- Renders a <p> with body-medium styles -->
 * <moni-typography variant="body">Standard paragraph text.</moni-typography>
 *
 * <!-- Overriding the semantic tag -->
 * <moni-typography variant="title" as="span">Inline title</moni-typography>
 * ```
 *
 * @slot default - The text content to display.
 */
@customElement('moni-typography')
export class MoniTypography extends MoniElement {
	@property({ reflect: true })
	variant: 'display' | 'headline' | 'title' | 'body' | 'label' = 'body';
	@property({ reflect: true })
	size: 'large' | 'medium' | 'small' = 'medium';
	@property({ reflect: true })
	as: string | null = null;
	@property({ reflect: true }) text = '';

	/** Default semantic tag for each variant per M3 spec. */
	private static _tagFor(
		variant: 'display' | 'headline' | 'title' | 'body' | 'label'
	): string {
		switch (variant) {
			case 'display':
				return 'h1';
			case 'headline':
				return 'h2';
			case 'title':
				return 'h3';
			case 'body':
				return 'p';
			case 'label':
				return 'label';
		}
	}

	override render() {
		const cls = `${this.variant} ${this.size}`;
		const tag = this.as ?? MoniTypography._tagFor(this.variant);
		// Render the dynamic tag with `unsafeStatic` so we don't hit the
		// "Bindings in tag names are not supported" error from lit 3.
		const tagStatic = unsafeStatic(tag);
		return staticHtml`<${tagStatic}
			class=${cls}
			part="text"
		>
			<slot>${this.text || nothing}</slot>
		</${tagStatic}>`;
	}

	static override styles = [
		sharedStyles,
		css`
			:host {
				display: block;
				font-family: var(--font);
				color: inherit;
				margin: 0;
				padding: 0;
			}
			:host([variant='label']) {
				display: inline-block;
			}

			/* ─── M3 Display (largest) ─── */
			.display.large {
				font-size: 3.5625rem;
				line-height: 4rem;
				font-weight: 400;
				letter-spacing: -0.015625em;
			}
			.display.medium {
				font-size: 2.8125rem;
				line-height: 3.25rem;
				font-weight: 400;
				letter-spacing: 0;
			}
			.display.small {
				font-size: 2.25rem;
				line-height: 2.75rem;
				font-weight: 400;
				letter-spacing: 0;
			}

			/* ─── M3 Headline ─── */
			.headline.large {
				font-size: 2rem;
				line-height: 2.5rem;
				font-weight: 400;
				letter-spacing: 0;
			}
			.headline.medium {
				font-size: 1.75rem;
				line-height: 2.25rem;
				font-weight: 400;
				letter-spacing: 0;
			}
			.headline.small {
				font-size: 1.5rem;
				line-height: 2rem;
				font-weight: 400;
				letter-spacing: 0;
			}

			/* ─── M3 Title ─── */
			.title.large {
				font-size: 1.375rem;
				line-height: 1.75rem;
				font-weight: 400;
				letter-spacing: 0;
			}
			.title.medium {
				font-size: 1rem;
				line-height: 1.5rem;
				font-weight: 500;
				letter-spacing: 0.009375em;
			}
			.title.small {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 500;
				letter-spacing: 0.00714em;
			}

			/* ─── M3 Body ─── */
			.body.large {
				font-size: 1rem;
				line-height: 1.5rem;
				font-weight: 400;
				letter-spacing: 0.03125em;
			}
			.body.medium {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 400;
				letter-spacing: 0.01786em;
			}
			.body.small {
				font-size: 0.75rem;
				line-height: 1rem;
				font-weight: 400;
				letter-spacing: 0.03333em;
			}

			/* ─── M3 Label ─── */
			.label.large {
				font-size: 0.875rem;
				line-height: 1.25rem;
				font-weight: 500;
				letter-spacing: 0.00714em;
			}
			.label.medium {
				font-size: 0.75rem;
				line-height: 1rem;
				font-weight: 500;
				letter-spacing: 0.04545em;
			}
			.label.small {
				font-size: 0.6875rem;
				line-height: 1rem;
				font-weight: 500;
				letter-spacing: 0.04545em;
			}
		`
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'moni-typography': MoniTypography;
	}
}

export default MoniTypography;