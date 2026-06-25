import { css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { unsafeStatic, html as staticHtml } from 'lit/static-html.js';
import { MoniElement, sharedStyles } from './_base/index.js';

/**
 * Material 3 Typography (`m3-docs/components/`).
 *
 * Renders a single piece of text using the M3 type scale. The component
 * chooses both the semantic tag and the typography class based on the
 * `variant` attribute. Consumers can override the tag via `as`.
 *
 * M3 type scale (5 categories, 3 sizes each):
 *  - **display**: largest text, used for marketing or hero content.
 *  - **headline**: page-level headings (H1 equivalent).
 *  - **title**:    section headings, dialog titles.
 *  - **body**:     paragraph text.
 *  - **label**:    button text, captions.
 *
 * Each category has `large`, `medium`, and `small` sizes (per M3 spec).
 *
 * Attributes:
 *  - variant: display | headline | title | body | label (default body)
 *  - size:    large | medium | small (default medium)
 *  - as:      override the rendered tag (e.g. "span", "p", "label")
 *
 * Slots:
 *  - default: text content (falls back to `text` attribute if empty)
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