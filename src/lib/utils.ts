export function hideElement(element: HTMLElement) {
    if (element) {
        element.classList.add('hidden');
    }
}

export function showElement(element: HTMLElement) {
    if (element) {
        element.classList.remove('hidden');
    }
}

// Adapted from https://learn.svelte.dev/tutorial/actions
export function trapFocus(element: HTMLElement) {
    const previous = document.activeElement as HTMLElement;

    function focusable(): HTMLElement[] {
        return Array.from(
            element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            ),
        );
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key !== 'Tab') return;

        const current = document.activeElement;

        const elements = focusable();
        const first = elements.at(0)!;
        const last = elements.at(-1)!;

        if (event.shiftKey && current === first) {
            last.focus();
            event.preventDefault();
        }

        if (!event.shiftKey && current === last) {
            first.focus();
            event.preventDefault();
        }
    }

    const classObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (
                mutation.type === 'attributes' &&
                mutation.attributeName === 'class'
            ) {
                focusable()[0]?.focus();
            }
        });
    });
    classObserver.observe(element, { attributes: true });

    element.addEventListener('keydown', handleKeydown);

    return {
        destroy() {
            element.removeEventListener('keydown', handleKeydown);
            previous?.focus();
        },
    };
}
