class MockIntersectionObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
	takeRecords() {
		return [];
	}
}

class MockResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

if (typeof globalThis.IntersectionObserver === 'undefined') {
	(globalThis as any).IntersectionObserver = MockIntersectionObserver;
}

if (typeof globalThis.ResizeObserver === 'undefined') {
	(globalThis as any).ResizeObserver = MockResizeObserver;
}

if (typeof globalThis.matchMedia === 'undefined') {
	(globalThis as any).matchMedia = (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false
	});
}

if (typeof ElementInternals !== 'undefined') {
	if (!ElementInternals.prototype.setFormValue) {
		(ElementInternals.prototype as any).setFormValue = function () {};
	}
	if (!ElementInternals.prototype.setValidity) {
		(ElementInternals.prototype as any).setValidity = function () {};
	}
}

if (!HTMLElement.prototype.attachInternals) {
	(HTMLElement.prototype as any).attachInternals = function () {
		return {
			setFormValue: () => {},
			setValidity: () => {},
			validationMessage: '',
			willValidate: false,
			validity: {},
			checkValidity: () => true,
			reportValidity: () => true,
			labels: []
		};
	};
}
